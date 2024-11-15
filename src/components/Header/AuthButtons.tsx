import React from 'react';
import {Button, Space} from 'antd';
import {useAuth} from '../../contexts/AuthContext';
import {UserAvatar} from './UserAvatar';

interface AuthButtonsProps {
    onOpenModal: (view: 'login' | 'register') => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({onOpenModal}) => {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        return <UserAvatar/>;
    }

    return (
    <Space>
        <Button type="text" onClick={() => onOpenModal('login')}>
            登录
        </Button>
        <Button type="primary" onClick={() => onOpenModal('register')}>
            注册
        </Button>
    </Space>
    );
}; 