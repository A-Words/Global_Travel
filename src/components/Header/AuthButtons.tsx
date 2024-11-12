import React from 'react';
import { Button, Space } from 'antd';

// 登录/注册按钮组件的属性类型
interface AuthButtonsProps {
    onOpenModal: (view: 'login' | 'register') => void;
}

// 登录/注册按钮组件
export const AuthButtons: React.FC<AuthButtonsProps> = ({ onOpenModal }) => (
    <Space>
        <Button onClick={() => onOpenModal('login')}>
            登录
        </Button>
        <Button 
            type="primary" 
            onClick={() => onOpenModal('register')}
        >
            注册
        </Button>
    </Space>
); 