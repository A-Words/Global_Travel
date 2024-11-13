import React, {useEffect} from 'react';
import {Alert, Button, Card, Col, Input, Layout, Row, Select, Space, Spin, Tag, Typography} from 'antd';
import {EnvironmentOutlined, GlobalOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useHeritageStore} from '../stores/heritageStore';
import styles from './Destinations.module.css';

const {Content} = Layout;
const {Title, Paragraph} = Typography;
const {Search} = Input;

const Destinations: React.FC = () => {
    const {loading, error, fetchHeritages, setFilters, filteredHeritages} = useHeritageStore();
    const navigate = useNavigate();

    const categories = ['文化遗产', '自然遗产', '建筑', '古迹', '宗教场所'];

    useEffect(() => {
        fetchHeritages();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" tip="加载中..."/>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Alert
                    message="加载失败"
                    description={error}
                    type="error"
                    action={
                        <Button icon={<ReloadOutlined/>} onClick={() => fetchHeritages()}>
                            重试
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <Content className={styles.container}>
            <Title level={2} className={styles.pageTitle}>探索世界文化遗产</Title>
            <Space direction="vertical" size="large" style={{width: '100%'}}>
                <Row gutter={[16, 16]} align="middle" className={styles.searchSection}>
                    <Col xs={24} sm={12}>
                        <Search
                            placeholder="搜索遗产名称或地点"
                            allowClear
                            enterButton={<SearchOutlined/>}
                            size="large"
                            onChange={e => setFilters({searchText: e.target.value})}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <Select
                            mode="multiple"
                            placeholder="选择分类"
                            style={{width: '100%'}}
                            options={categories.map(cat => ({label: cat, value: cat}))}
                            onChange={categories => setFilters({categories})}
                            size="large"
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    {filteredHeritages.map(heritage => (
                        <Col xs={24} sm={12} md={8} lg={6} key={heritage.id}>
                            <Card
                                hoverable
                                className={styles.card}
                                cover={
                                    <div
                                        className={styles.cardImage}
                                        style={{backgroundImage: `url(${heritage.imageUrl})`}}
                                    />
                                }
                                actions={[
                                    heritage.hasVR && (
                                        <Button
                                            type="link"
                                            icon={<GlobalOutlined/>}
                                            onClick={() => navigate(`/virtual-tour?site=${heritage.id}`)}
                                        >
                                            VR体验
                                        </Button>
                                    ),
                                    heritage.hasAR && (
                                        <Button
                                            type="link"
                                            icon={<EnvironmentOutlined/>}
                                            onClick={() => navigate(`/model-preview?site=${heritage.id}`)}
                                        >
                                            AR预览
                                        </Button>
                                    )
                                ].filter(Boolean)}
                            >
                                <Card.Meta
                                    className={styles.cardMeta}
                                    title={heritage.name}
                                    description={
                                        <>
                                            <Paragraph className={styles.location}>
                                                {heritage.location}
                                            </Paragraph>
                                            <Space size={[0, 8]} wrap>
                                                {heritage.category.map(cat => (
                                                    <Tag key={cat} color="blue">{cat}</Tag>
                                                ))}
                                            </Space>
                                            <Paragraph
                                                ellipsis={{rows: 2}}
                                                className={styles.description}
                                            >
                                                {heritage.description}
                                            </Paragraph>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Space>
        </Content>
    );
};

export default Destinations; 