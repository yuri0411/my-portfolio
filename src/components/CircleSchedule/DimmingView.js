import React from 'react';
import { Badge, Col, Empty, Row, Tag } from 'antd';
import ReactEcharts from '../../../../components/chart/ReactEcharts';
import { defaultProfileTitle } from '../../constants/constants';
import { TAG_STYLE } from './DimmingSettingUtils';
import { isEmpty } from 'lodash';
import i18n from 'i18next';

const TYPE_OF_DIMMING_STATUS = {
    SAVED: { name: i18n.t('smls.saved'), color: '#87d068' },
    APPLIED: { name: i18n.t('smls.applied'), color: '#108ee9' },
};

const DimmingView = (props) => {
    const { dimChartRef, dimSettingTagList, profileName, initChartOption, dimStatus } = props;

    return (
        <Row style={{ height: '100%' }} align={'middle'} justify={'center'} type={'flex'}>
            {!isEmpty(dimSettingTagList) ? (
                <>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Badge
                            color={TYPE_OF_DIMMING_STATUS[dimStatus]?.color}
                            text={TYPE_OF_DIMMING_STATUS[dimStatus]?.name}
                        />
                    </Col>
                    <Col span={15}>
                        <ReactEcharts
                            ref={dimChartRef}
                            option={initChartOption}
                            width={360}
                            height={360}
                            style={{ margin: '0 auto' }}
                        />
                    </Col>
                    <Col
                        span={9}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 355,
                            overflow: 'auto',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                        }}
                    >
                        <Col span={20}>
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 10,
                                }}
                            >
                                [{' '}
                                {profileName === defaultProfileTitle
                                    ? i18n.t('smls.basic-operation-policy')
                                    : profileName}{' '}
                                ]
                            </div>
                            {dimSettingTagList?.map((tagData) => (
                                <Tag style={TAG_STYLE(tagData.color)} className="at-dimming-tag" key={tagData.color}>
                                    {tagData.color === '#ccc'
                                        ? `[${i18n.t('action.clear')}] ${i18n.t('chart.min')}: ${
                                              tagData.dimMin
                                          } ~ ${i18n.t('chart.max')}: ${tagData.dimMax}`
                                        : `${i18n.t('chart.min')}: ${tagData.dimMin} ~ ${i18n.t('chart.max')}: ${
                                              tagData.dimMax
                                          }`}
                                </Tag>
                            ))}
                        </Col>
                    </Col>
                </>
            ) : (
                <Empty />
            )}
        </Row>
    );
};

export default DimmingView;
