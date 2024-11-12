import React from 'react';
import { Modal } from 'antd';
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
                <Login onSwitchToRegister={() => onSwitchView('register')} />
            ) : (
                <Register onSwitchToLogin={() => onSwitchView('login')} />
            )}
        </Modal>
    );
};