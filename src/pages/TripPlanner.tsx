import React, {useState} from 'react';
import {Button, Card, DatePicker, InputNumber, Layout, message, Select, Space, Steps, Typography} from 'antd';
import {CalendarOutlined, EnvironmentOutlined, RocketOutlined, TeamOutlined} from '@ant-design/icons';
import type {Dayjs} from 'dayjs';
import styles from './TripPlanner.module.css';

const {Content} = Layout;
const {Title, Paragraph} = Typography;
const {RangePicker} = DatePicker;

interface TripPreference {
    destinations: string[];
    dateRange: [Dayjs | null, Dayjs | null] | null;
    travelers: number;
    interests: string[];
}

const TripPlanner: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [, setPreferences] = useState<TripPreference>({
        destinations: [],
        dateRange: null,
        travelers: 1,
        interests: []
    });

    const handleGeneratePlan = async () => {
        setLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        message.success('行程规划生成成功！');
        setCurrent(3);
    };

    const steps = [
        {
            title: '选择目的地',
            icon: <EnvironmentOutlined/>,
            content: (
                <Card>
                    <Select
                        mode="multiple"
                        style={{width: '100%'}}
                        placeholder="选择想要游览的文化遗产"
                        onChange={(value) => setPreferences(prev => ({...prev, destinations: value}))}
                        options={[
                            {label: '长城', value: 'great-wall'},
                            {label: '埃及金字塔', value: 'pyramids'},
                            {label: '泰姬陵', value: 'taj-mahal'}
                        ]}
                    />
                </Card>
            )
        },
        {
            title: '选择日期',
            icon: <CalendarOutlined/>,
            content: (
                <Card>
                    <Space direction="vertical" size="large" style={{width: '100%'}}>
                        <RangePicker
                            style={{width: '100%'}}
                            onChange={(dates) => setPreferences(prev => ({...prev, dateRange: dates}))}
                        />
                        <Space>
                            <TeamOutlined/>
                            <span>出行人数：</span>
                            <InputNumber
                                min={1}
                                max={10}
                                defaultValue={1}
                                onChange={(value) => setPreferences(prev => ({...prev, travelers: value || 1}))}
                            />
                        </Space>
                    </Space>
                </Card>
            )
        },
        {
            title: '个性化定制',
            icon: <RocketOutlined/>,
            content: (
                <Card>
                    <Select
                        mode="multiple"
                        style={{width: '100%'}}
                        placeholder="选择感兴趣的主题"
                        onChange={(value) => setPreferences(prev => ({...prev, interests: value}))}
                        options={[
                            {label: '历史文化', value: 'history'},
                            {label: '建筑艺术', value: 'architecture'},
                            {label: '自然风光', value: 'nature'},
                            {label: '宗教信仰', value: 'religion'}
                        ]}
                    />
                </Card>
            )
        }
    ];

    return (
        <Content className={styles.container}>
            <Space direction="vertical" size="large" style={{width: '100%'}}>
                <div className={styles.header}>
                    <Title level={2}>智能行程规划</Title>
                    <Paragraph>
                        基于AI算法，为您量身定制最优文化遗产游览路线
                    </Paragraph>
                </div>

                <Steps
                    current={current}
                    items={steps.map(item => ({
                        title: item.title,
                        icon: item.icon
                    }))}
                />

                <div className={styles.stepsContent}>
                    {steps[current]?.content}
                </div>

                <div className={styles.stepsAction}>
                    {current > 0 && (
                        <Button style={{margin: '0 8px'}} onClick={() => setCurrent(current - 1)}>
                            上一步
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => setCurrent(current + 1)}>
                            下一步
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={handleGeneratePlan} loading={loading}>
                            生成行程
                        </Button>
                    )}
                </div>
            </Space>
        </Content>
    );
};

export default TripPlanner; 