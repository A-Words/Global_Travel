import React from 'react';
import {Modal} from 'antd';
import {useLocation} from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';

interface HeaderModalProps {
    visible: boolean;
    currentView: 'login' | 'register';
    onClose: () => void;
    onSwitchView: (view: 'login' | 'register') => void;
}

export const HeaderModal: React.FC<HeaderModalProps> = ({
    visible,
    currentView,
    onClose,
    onSwitchView
}) => {
    const location = useLocation();
    const redirectUrl = location.pathname === '/login' ? '/' : location.pathname;

    return (
        <Modal
            title={currentView === 'login' ? "登录" : "注册"}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            destroyOnClose
            maskClosable={false}
        >
            {currentView === 'login' ? (
                <Login
                    onSwitchToRegister={() => onSwitchView('register')}
                    onClose={onClose}
                    redirectUrl={redirectUrl}
                />
            ) : (
                <Register
                    onSwitchToLogin={() => onSwitchView('login')}
                    onClose={onClose}
                    redirectUrl={redirectUrl}
                />
            )}
        </Modal>
    );
};