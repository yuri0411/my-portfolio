import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Divider, Input, message, Row, Select, Tag } from 'antd';
import Helper from '../../../../components/common/helper/Helper';
import ReactEcharts from '../../../../components/chart/ReactEcharts';
import { getColorPalette, getDimChartOption, SELECTED_TAG_STYLE, TAG_STYLE } from './DimmingSettingUtils';
import i18n from 'i18next';
import Icon from 'polestar-icons';
import { isEmpty } from 'lodash';

const { Option } = Select;
const InputGroup = Input.Group;

const getDimOptionValue = () => {
    const dimOptionValue = [];
    for (let i = 0; i <= 100; i += 10) {
        dimOptionValue.push(
            <Option value={i} key={i}>
                {i}
            </Option>,
        );
    }
    return dimOptionValue;
};

const DimmingEdit = (props) => {
    const { dimSettingTagList, dimChartRef, initColorArr, initChartOption, setDimSettingTagList } = props;
    const [minMaxValue, setMinMaxValue] = useState({ min: 0, max: 100 });
    const [selectedDimTag, setSelectedDimTag] = useState();
    const defaultPaintOption = {
        startIndex: undefined,
        endIndex: undefined,
        color: '',
    };
    const paintOption = useRef(defaultPaintOption);
    const [colorArr, setColorArr] = useState(initColorArr);
    const [dimChartOption, setDimChartOption] = useState(initChartOption);

    const handleChangeMinMaxValue = (label) => (value) => {
        setMinMaxValue({ ...minMaxValue, [label]: value });
    };

    const getFilterColor = () => {
        const tagPalette = getColorPalette();
        const tagColorList = dimSettingTagList.map((tagData) => {
            return tagData.color;
        });
        const newTagPalette = tagPalette.reduce((acc, datum) => {
            if (!tagColorList.includes(datum)) {
                acc.push(datum);
            }
            return acc;
        }, []);

        return newTagPalette[0];
    };

    const settingChartColors = ({ startIndex, endIndex, color }, colorArr) => {
        const newColorArr = [...colorArr];
        if (startIndex > endIndex) {
            for (let i = startIndex; i <= 23; i++) {
                newColorArr[i] = color;
            }
            for (let j = 0; j <= endIndex; j++) {
                newColorArr[j] = color;
            }
        } else {
            for (let i = startIndex; i <= endIndex; i++) {
                newColorArr[i] = color;
            }
        }
        setColorArr(newColorArr);
        updateTimeIndex(newColorArr);
    };

    const updateTimeIndex = (colorArr) => {
        const newTagList = dimSettingTagList.map((tagData) => {
            const newTimeIndex = [];
            colorArr.forEach((color, index) => {
                if (tagData.color === color) {
                    newTimeIndex.push(index);
                }
            });
            return { ...tagData, time: newTimeIndex };
        });
        setDimSettingTagList(newTagList);
    };

    const getValidValues = () => {
        let errorMsg = '';
        const minMaxList = dimSettingTagList.map((tagData) => {
            return JSON.stringify(tagData.dimMin) + JSON.stringify(tagData.dimMax);
        });
        const curMinMaxValue = JSON.stringify(minMaxValue.min) + JSON.stringify(minMaxValue.max);

        if (minMaxValue.min > minMaxValue.max) {
            errorMsg += i18n.t('smls.dimming-validator-msg1');
        } else if (dimSettingTagList.length >= 25) {
            errorMsg += i18n.t('smls.dimming-validator-msg2');
        }
        if (minMaxList.includes(curMinMaxValue)) {
            errorMsg += i18n.t('smls.dimming-validator-msg3');
        }
        return errorMsg;
    };

    const handleAddTag = () => {
        const errorMsg = getValidValues();
        if (isEmpty(errorMsg)) {
            setDimSettingTagList(
                dimSettingTagList.concat({
                    color: getFilterColor(),
                    dimMin: minMaxValue.min,
                    dimMax: minMaxValue.max,
                    time: [],
                }),
            );
        } else {
            message.error(errorMsg);
        }
    };

    const handleDeleteTag = (tagData, colorArr) => {
        const changedColorArr = colorArr.map((color) => {
            if (color === tagData.color) {
                return '#ccc';
            }
            return color;
        });

        const newTagList = dimSettingTagList
            .filter((selectedTag) => {
                return selectedTag.color !== tagData.color;
            })
            .map((data) => {
                const newTimeIndex = [];
                changedColorArr.forEach((color, index) => {
                    if (data.color === color) {
                        newTimeIndex.push(index);
                    }
                });
                return { ...data, time: newTimeIndex };
            });

        setColorArr(changedColorArr);
        setDimChartOption(getDimChartOption(changedColorArr));
        setSelectedDimTag({});
        setDimSettingTagList(newTagList);
    };

    useEffect(() => {
        if (dimChartRef.current && selectedDimTag) {
            dimChartRef.current.getChartInstance().off('click');
            dimChartRef.current.getChartInstance().on('click', (params) => {
                const { dataIndex } = params;
                dimChartRef.current.getChartInstance().dispatchAction({
                    type: 'highlight',
                    seriesIndex: params.seriesIndex,
                    dataIndex: params.dataIndex,
                });
                if (!isEmpty(selectedDimTag)) {
                    paintOption.current.color = selectedDimTag.color;

                    if (paintOption.current.startIndex === undefined) {
                        paintOption.current.startIndex = dataIndex;
                    } else if (
                        typeof paintOption.current.startIndex === 'number' &&
                        paintOption.current.endIndex === undefined
                    ) {
                        paintOption.current.endIndex = dataIndex;
                        settingChartColors(paintOption.current, colorArr);
                    }
                }
            });
            // 클릭 두번이 끝났을 때 처리
            if (paintOption.current.startIndex !== undefined && paintOption.current.endIndex !== undefined) {
                const newChartOption = getDimChartOption(colorArr);
                setDimChartOption(newChartOption);
                paintOption.current = defaultPaintOption;
            }
        }
    }, [selectedDimTag, colorArr]);

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <span>{i18n.t('smls.dimming')}</span>
                <Helper
                    text={() => (
                        <>
                            <div>- {i18n.t('smls.dimming-help1')}</div>
                            <div>- {i18n.t('smls.dimming-help2')}</div>
                            <div>- {i18n.t('smls.dimming-help3')}</div>
                            <div>- {i18n.t('smls.dimming-help4')}</div>
                        </>
                    )}
                    overlayStyle={{ maxWidth: 500 }}
                    icon={'question-circle-o'}
                    iconStyle={{ fontSize: '10px', marginLeft: 5 }}
                    direction={'right'}
                />
            </Col>
            <Col span={24}>
                <Col span={15}>
                    <ReactEcharts ref={dimChartRef} option={dimChartOption} width={340} height={340} />
                </Col>
                <Col span={9} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: 5 }}>
                        {i18n.t('chart.min')} / {i18n.t('chart.max')}
                    </div>
                    <Row gutter={[16, 16]}>
                        <Col span={18} style={{ paddingRight: 0 }}>
                            <InputGroup compact>
                                <Select
                                    defaultValue={0}
                                    style={{ width: '50%', textAlign: 'center', borderRight: 0 }}
                                    onChange={handleChangeMinMaxValue('min')}
                                >
                                    {getDimOptionValue()}
                                </Select>
                                <Select
                                    defaultValue="100"
                                    style={{ width: '50%', textAlign: 'center', borderLeft: 0 }}
                                    onChange={handleChangeMinMaxValue('max')}
                                >
                                    {getDimOptionValue()}
                                </Select>
                            </InputGroup>
                        </Col>
                        <Col span={6}>
                            <Button
                                type="primary"
                                style={{ padding: 0, width: '100%' }}
                                onClick={() => {
                                    handleAddTag();
                                }}
                            >
                                <Icon name="plus" />
                            </Button>
                        </Col>
                    </Row>
                    <Divider style={{ margin: '10px 0' }} />
                    <Row
                        style={{
                            height: 260,
                            overflow: 'auto',
                            display: 'flex',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                        }}
                    >
                        {dimSettingTagList?.map((tagData) => (
                            <Tag
                                tabIndex={0}
                                style={
                                    selectedDimTag?.color === tagData.color
                                        ? SELECTED_TAG_STYLE(tagData.color)
                                        : TAG_STYLE(tagData.color)
                                }
                                className="at-dimming-tag"
                                closable={tagData.color !== '#ccc'}
                                onClose={() => {
                                    paintOption.current = defaultPaintOption;
                                    handleDeleteTag(tagData, colorArr);
                                }}
                                color={tagData.color}
                                key={tagData.color}
                                onClick={() => {
                                    paintOption.current = defaultPaintOption;
                                    setSelectedDimTag(tagData);
                                }}
                            >
                                {tagData.color === '#ccc'
                                    ? `[${i18n.t('action.clear')}] ${i18n.t('chart.min')}: ${tagData.dimMin} ~ ${i18n.t(
                                          'chart.max',
                                      )}: ${tagData.dimMax}`
                                    : `${i18n.t('chart.min')}: ${tagData.dimMin} ~ ${i18n.t('chart.max')}: ${
                                          tagData.dimMax
                                      }`}
                            </Tag>
                        ))}
                    </Row>
                </Col>
            </Col>
        </Row>
    );
};

export default DimmingEdit;
