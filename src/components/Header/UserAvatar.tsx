import React from 'react';
import type {MenuProps} from 'antd';
import {Avatar, Button, Dropdown, Flex, Grid} from 'antd';
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';

export const UserAvatar: React.FC = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();

    const items: MenuProps['items'] = [
        {
            key: 'settings',
            label: '个人设置',
            icon: <SettingOutlined/>,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined/>,
            onClick: () => {
                logout();
                navigate('/');
            },
        },
    ];

    return (
        <Dropdown menu={{items}} placement="bottomRight">
            <Button type="text" style={{height: '48px'}}>
                <Flex align="center" gap={8}>
                    <Avatar
                        style={{backgroundColor: '#1890ff'}}
                        icon={<UserOutlined/>}
                    >
                        {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    {screens.md && <span>{user?.username}</span>}
                </Flex>
            </Button>
        </Dropdown>
    );
}; 