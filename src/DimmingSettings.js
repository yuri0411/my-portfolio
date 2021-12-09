import React, { useEffect, useRef, useState } from 'react';
import DimmingView from './DimmingView';
import DimmingEdit from './DimmingEdit';
import { getProfile } from '../../services/api/slms.service';
import { getDimChartOption, getInitColorArr } from './DimmingSettingUtils';
import { isEmpty } from 'lodash';

const DimmingSettings = (props) => {
    const { type, profileInfo, setChangedDimmingSettings, resource } = props;
    const dimChartRef = useRef();
    const mounted = useRef(false);
    const [dimSettingTagList, setDimSettingTagList] = useState();
    const [profileName, setProfileName] = useState();
    const [dimStatus, setDimStatus] = useState();
    const initColorArr = resource ? getInitColorArr(dimSettingTagList) : getInitColorArr(profileInfo.minMax);
    const initChartOption = getDimChartOption(initColorArr);

    useEffect(() => {
        if (type === 'edit') {
            const mergeTagList = profileInfo.minMax.concat(profileInfo.tags);

            let reArr = [];
            mergeTagList.forEach((tagData) => {
                if (tagData.color !== '#ccc') {
                    reArr.push(tagData);
                } else {
                    reArr.unshift(tagData);
                }
            });
            setDimSettingTagList(reArr);
        }
    }, []);

    useEffect(() => {
        if (type === 'edit') {
            const unAppliedTagList = dimSettingTagList?.filter((tagData) => {
                return isEmpty(tagData.time);
            });
            const appliedTagList = dimSettingTagList?.filter((tagData) => {
                return !isEmpty(tagData.time);
            });
            setChangedDimmingSettings({ minMax: appliedTagList, tags: unAppliedTagList });
        }
    }, [dimSettingTagList]);

    useEffect(() => {
        mounted.current = true;
        if (resource) {
            const getProfileInfo = async () => {
                try {
                    const response = await getProfile('resourceId', resource?.id, resource?.resourceTypeName);
                    const { minMax, title, status } = response.data;
                    mounted.current && setDimSettingTagList(minMax);
                    mounted.current && setProfileName(title);
                    mounted.current && setDimStatus(status);
                } catch (e) {
                    console.error(`[Error] getProfileInfo ${e}`);
                }
            };
            getProfileInfo();
        }
        return () => {
            mounted.current = false;
        };
    }, [resource?.id]);

    return (
        <>
            {type === 'edit' ? (
                <DimmingEdit
                    dimChartRef={dimChartRef}
                    dimSettingTagList={dimSettingTagList}
                    initColorArr={initColorArr}
                    initChartOption={initChartOption}
                    setDimSettingTagList={setDimSettingTagList}
                />
            ) : (
                <DimmingView
                    dimChartRef={dimChartRef}
                    dimSettingTagList={dimSettingTagList}
                    profileName={profileName}
                    dimStatus={dimStatus}
                    initChartOption={initChartOption}
                />
            )}
        </>
    );
};

export default React.memo(DimmingSettings);
