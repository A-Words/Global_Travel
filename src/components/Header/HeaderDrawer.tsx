import React from 'react';
import { Drawer, Menu, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { menuItems } from './constants';
import styles from './Header.module.css';

// 抽屉菜单组件的属性类型
interface HeaderDrawerProps {
    visible: boolean;
    onClose: () => void;
    onOpenModal: (view: 'login' | 'register') => void;
}

// 移动端抽屉菜单组件
export const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
    visible,
    onClose
}) => {
    return (
        <Drawer
            title={null}
            placement="left"
            onClose={onClose}
            open={visible}
            bodyStyle={{ padding: 0 }}
            width={280}
            closable={false}
        >
            <div className={styles.drawerHeader}>
                <Button 
                    type="text" 
                    icon={<CloseOutlined />}
                    onClick={onClose}
                    className={styles.drawerCloseButton}
                />
                <span className={styles.drawerTitle}>菜单</span>
            </div>
            <Menu
                mode="vertical"
                items={menuItems}
                className={styles.drawerMenu}
            />
        </Drawer>
    );
}; 