/**
 * 页脚版权信息组件
 * 显示版权声明文本
 * 使用 Ant Design 的 Typography 组件实现
 */
import React from 'react';
import {Typography} from 'antd';
import styles from './Footer.module.css';

const { Text } = Typography;

export const FooterCopyright: React.FC = () => {
    return (
        <div className={styles.copyright}>
            <Text>
                © 2024 Traveler. All rights reserved.
            </Text>
        </div>
    );
}; 