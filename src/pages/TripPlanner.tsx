import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Card,
    DatePicker,
    Empty,
    InputNumber,
    Layout,
    message,
    Select,
    Space,
    Steps,
    Typography
} from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    ReloadOutlined,
    RocketOutlined,
    TeamOutlined
} from '@ant-design/icons';
import type {Dayjs} from 'dayjs';
import styles from './TripPlanner.module.css';
import {useHeritageStore} from '../stores/heritageStore';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';

const {Content} = Layout;
const {Title, Paragraph} = Typography;
const {RangePicker} = DatePicker;

interface TripPreference {
    destinations: string[];
    dateRange: [Dayjs | null, Dayjs | null] | null;
    travelers: number;
    interests: string[];
}

interface TripPlan {
    id: string;
    preferences: TripPreference;
    plan: string;
}

interface DateRangeSelectorProps {
    setPreferences: React.Dispatch<React.SetStateAction<TripPreference>>;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({setPreferences}) => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        return (
            <Space direction="vertical" size="middle" style={{width: '100%'}}>
                <DatePicker
                    style={{width: '100%'}}
                    placeholder="选择开始日期"
                    onChange={(date) => {
                        setPreferences(prev => ({
                            ...prev,
                            dateRange: [date, prev.dateRange?.[1] || null]
                        }));
                    }}
                />
                <DatePicker
                    style={{width: '100%'}}
                    placeholder="选择结束日期"
                    onChange={(date) => {
                        setPreferences(prev => ({
                            ...prev,
                            dateRange: [prev.dateRange?.[0] || null, date]
                        }));
                    }}
                />
            </Space>
        );
    }

    return (
        <RangePicker
            style={{width: '100%'}}
            onChange={(dates) => {
                if (dates) {
                    setPreferences(prev => ({
                        ...prev,
                        dateRange: [dates[0], dates[1]]
                    }));
                } else {
                    setPreferences(prev => ({
                        ...prev,
                        dateRange: null
                    }));
                }
            }}
        />
    );
};

const TripPlanner: React.FC = () => {
    const {loading: heritageLoading, error, fetchHeritages, filteredHeritages} = useHeritageStore();
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<TripPlan | null>(null);
    const [preferences, setPreferences] = useState<TripPreference>({
        destinations: [],
        dateRange: null,
        travelers: 1,
        interests: []
    });
    const {isAuthenticated, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchHeritages();
    }, []);

    const handleGeneratePlan = async () => {
        if (!isAuthenticated) {
            message.warning('请先登录后再生成行程');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/trips/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    preferences,
                    userId: user?.id
                })
            });

            if (!response.ok) {
                throw new Error('生成行程计划失败');
            }

            const data = await response.json();
            setPlan(data);
            message.success('行程规划生成成功！已保存到您的账户');
            setCurrent(3);
        } catch (error) {
            message.error('生成行程计划失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: '选择目的地',
            icon: <EnvironmentOutlined/>,
            content: (
                <Card>
                    {error ? (
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
                    ) : (
                        <Select
                            mode="multiple"
                            style={{width: '100%'}}
                            placeholder="选择想要游览的文化遗产"
                            onChange={(value) => setPreferences(prev => ({...prev, destinations: value}))}
                            options={filteredHeritages.map(heritage => ({
                                label: heritage.name,
                                value: heritage.id
                            }))}
                            loading={heritageLoading}
                        />
                    )}
                </Card>
            )
        },
        {
            title: '选择日期',
            icon: <CalendarOutlined/>,
            content: (
                <Card>
                    <Space direction="vertical" size="large" style={{width: '100%'}}>
                        <DateRangeSelector setPreferences={setPreferences}/>
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
        },
        {
            title: '行程预览',
            icon: <FileTextOutlined/>,
            content: (
                <Card>
                    {plan ? (
                        <Space direction="vertical" size="large" style={{width: '100%'}}>
                            <Alert
                                message="行程生成成功"
                                description="以下是为您定制的行程安排"
                                type="success"
                                showIcon
                            />
                            <Typography>
                      <pre style={{
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                      }}>
                        {plan.plan}
                      </pre>
                            </Typography>
                        </Space>
                    ) : (
                        <Empty description="暂无行程计划"/>
                    )}
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