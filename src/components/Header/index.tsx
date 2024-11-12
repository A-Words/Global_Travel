import React, { useState } from 'react';
import { Layout } from 'antd';
import { HeaderContent } from './HeaderContent';
import { HeaderDrawer } from './HeaderDrawer';
import { HeaderModal } from './HeaderModal';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
    const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    return (
        <AntHeader>
            <HeaderContent
                onOpenDrawer={() => setIsDrawerVisible(true)}
                onOpenModal={(view: 'login' | 'register') => {
                    setCurrentView(view);
                    setIsModalVisible(true);
                }}
            />
            <HeaderDrawer 
                visible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
                onOpenModal={(view: 'login' | 'register') => {
                    setCurrentView(view);
                    setIsModalVisible(true);
                }}
            />
            <HeaderModal 
                visible={isModalVisible}
                currentView={currentView}
                onClose={() => setIsModalVisible(false)}
                onSwitchView={setCurrentView}
            />
        </AntHeader>
    );
};