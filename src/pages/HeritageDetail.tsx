import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Button, Card, Col, Descriptions, Layout, Row, Space, Tag, Typography} from 'antd';
import {ArrowLeftOutlined, EnvironmentOutlined, GlobalOutlined, LoadingOutlined} from '@ant-design/icons';
import {useHeritageStore} from '../stores/heritageStore';
import styles from './HeritageDetail.module.css';

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const HeritageDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {selectedHeritage, loading, error, selectHeritage} = useHeritageStore();

    useEffect(() => {
        if (id) {
            selectHeritage(id);
        }
    }, [id]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loading}>
                    <LoadingOutlined/>
                    <span>加载中...</span>
                </div>
            </div>
        );
    }

    if (error || !selectedHeritage) {
        return (
            <div className={styles.errorContainer}>
                <Alert
                    message="加载失败"
                    description={error || '未找到该遗产信息'}
                    type="error"
                    action={
                        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined/>}>
                            返回
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <Content className={styles.container}>
            <Button
                icon={<ArrowLeftOutlined/>}
                onClick={() => navigate(-1)}
                className={styles.backButton}
            >
                返回
            </Button>

            <Card
                cover={
                    <div
                        className={styles.coverImage}
                        style={{backgroundImage: `url(${selectedHeritage.imageUrl})`}}
                    />
                }
            >
                <Space direction="vertical" size="large" style={{width: '100%'}}>
                    <div>
                        <Title level={2}>{selectedHeritage.name}</Title>
                        <Space size={[0, 8]} wrap>
                            {selectedHeritage.category.map(cat => (
                                <Tag key={cat} color="blue">{cat}</Tag>
                            ))}
                        </Space>
                    </div>

                    <Descriptions column={2}>
                        <Descriptions.Item label="位置">{selectedHeritage.location}</Descriptions.Item>
                        <Descriptions.Item label="国家">{selectedHeritage.country}</Descriptions.Item>
                        <Descriptions.Item label="入遗年份">{selectedHeritage.yearInscribed}</Descriptions.Item>
                    </Descriptions>

                    <Paragraph>{selectedHeritage.description}</Paragraph>

                    {selectedHeritage.visitingInfo && (
                        <Card title="参观信息" size="small">
                            <Descriptions column={1}>
                                <Descriptions.Item label="最佳游览时间">
                                    {selectedHeritage.visitingInfo.bestTime}
                                </Descriptions.Item>
                                <Descriptions.Item label="建议游览时长">
                                    {selectedHeritage.visitingInfo.duration}
                                </Descriptions.Item>
                                <Descriptions.Item label="门票价格">
                                    {selectedHeritage.visitingInfo.ticketPrice}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    )}

                    <Row gutter={16}>
                        {selectedHeritage.hasVR && (
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<GlobalOutlined/>}
                                    onClick={() => navigate(`/virtual-tour?site=${selectedHeritage.id}`)}
                                >
                                    VR体验
                                </Button>
                            </Col>
                        )}
                        {selectedHeritage.hasAR && (
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<EnvironmentOutlined/>}
                                    onClick={() => navigate(`/model-preview?site=${selectedHeritage.id}`)}
                                >
                                    AR预览
                                </Button>
                            </Col>
                        )}
                    </Row>
                </Space>
            </Card>
        </Content>
    );
};

export default HeritageDetail;