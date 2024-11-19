import React, {useEffect, useState} from 'react';
import {Card, List, message, Spin} from 'antd';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';

interface TripPlan {
    id: string;
    preferences: {
        destinations: string[];
        dateRange: [string, string] | null;
        travelers: number;
        interests: string[];
    };
    planContent: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
}

const MyTrips: React.FC = () => {
    const [trips, setTrips] = useState<TripPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/trips/my-trips', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('获取行程失败');
                }

                const data = await response.json();
                setTrips(data);
            } catch (error) {
                message.error('获取行程列表失败');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [isAuthenticated, navigate]);

    return (
        <div style={{padding: '24px'}}>
            <h1>我的行程</h1>
            <Spin spinning={loading}>
                <List
                    grid={{gutter: 16, column: 2}}
                    dataSource={trips}
                    renderItem={trip => (
                        <List.Item>
                            <Card
                                title={`行程 ${new Date(trip.createdAt).toLocaleDateString('zh-CN')}`}
                                extra={trip.status === 'completed' ? '已完成' : '处理中'}
                            >
                                <p>目的地: {trip.preferences.destinations.join(', ')}</p>
                                <p>出行人数: {trip.preferences.travelers}人</p>
                                <p>兴趣主题: {trip.preferences.interests.join(', ')}</p>
                                <div style={{
                                    maxHeight: '200px',
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {trip.planContent}
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </Spin>
        </div>
    );
};

export default MyTrips;