import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Card, Divider, Layout, Space, Typography} from 'antd';
import {ExperimentOutlined, EyeOutlined, GlobalOutlined, HomeOutlined} from '@ant-design/icons';

const {Content} = Layout;
const {Title, Text} = Typography;

const DebugPage: React.FC = () => {
    const navigate = useNavigate();

    const debugItems = [
        {
            title: '3D模型预览',
            description: '测试3D模型加载和AR预览功能',
            path: '/model-preview',
            icon: <EyeOutlined/>
        },
        {
            title: 'VR虚拟旅游',
            description: '测试VR全景图展示和交互功能',
            path: '/virtual-tour',
            icon: <GlobalOutlined/>
        },
        {
            title: '返回首页',
            description: '返回应用首页',
            path: '/',
            icon: <HomeOutlined/>
        }
    ];

    return (
        <Content style={{
            padding: '24px',
            marginTop: 'var(--header-height)'
        }}>
            <Card>
                <Space direction="vertical" style={{width: '100%'}} size="large" align="center">
                    <div style={{textAlign: 'center'}}>
                        <Title level={2}>
                            <ExperimentOutlined/> 调试页面
                        </Title>
                        <Text type="secondary">
                            此页面用于开发测试，提供快速访问各个功能模块的入口
                        </Text>
                    </div>

                    <Divider/>

                    <Space direction="vertical" style={{width: '100%', maxWidth: '500px'}}>
                        {debugItems.map((item) => (
                            <Card
                                key={item.path}
                                hoverable
                                style={{width: '100%'}}
                                onClick={() => navigate(item.path)}
                            >
                                <Space align="start">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={item.icon}
                                        size="large"
                                    />
                                    <Space direction="vertical" size={0}>
                                        <Title level={4} style={{margin: 0}}>
                                            {item.title}
                                        </Title>
                                        <Text type="secondary">
                                            {item.description}
                                        </Text>
                                    </Space>
                                </Space>
                            </Card>
                        ))}
                    </Space>
                </Space>
            </Card>
        </Content>
    );
};

export default DebugPage;
