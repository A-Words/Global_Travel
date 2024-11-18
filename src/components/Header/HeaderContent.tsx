import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Flex, Grid, Menu} from 'antd';
import {MenuOutlined, UserOutlined} from '@ant-design/icons';
import {menuItems} from './constants';
import {AuthButtons} from './AuthButtons';
import styles from './Header.module.css';
import {UserAvatar} from './UserAvatar';
import {useAuth} from '../../contexts/AuthContext';

// 头部内容组件的属性类型
interface HeaderContentProps {
    onOpenDrawer: () => void;
    onOpenModal: (view: 'login' | 'register') => void;
}

// 头部内容组件：包含导航菜单和认证按钮
export const HeaderContent: React.FC<HeaderContentProps> = ({ 
    onOpenDrawer, 
    onOpenModal 
}) => {
    const {isAuthenticated} = useAuth();
    const screens = Grid.useBreakpoint();

    return (
        <Flex align="center" className={styles.container}>
            {!screens.md ? (
                <Flex align="center" justify="space-between" className={styles.mobileHeader}>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={onOpenDrawer}
                        className={styles.mobileMenuButton}
                    />
                    <Link to="/" className={styles.mobileLogo}>
                        Traveler
                    </Link>
                    {isAuthenticated ? (
                        <UserAvatar/>
                    ) : (
                        <Button
                            type="text"
                            icon={<UserOutlined/>}
                            onClick={() => onOpenModal('login')}
                            className={styles.mobileMenuButton}
                        />
                    )}
                </Flex>
            ) : (
                // 桌面端布局
                <>
                    {/* Logo */}
                    <Link to="/" className={styles.logo}>
                        Traveler
                    </Link>
                    {/* 导航菜单和认证按钮 */}
                    <Flex align="center" gap="middle" flex={1}>
                        <Menu
                            mode="horizontal"
                            items={menuItems}
                            className={styles.menu}
                        />
                        <AuthButtons onOpenModal={onOpenModal} />
                    </Flex>
                </>
            )}
        </Flex>
    );
};