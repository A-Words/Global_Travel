/**
 * 页脚区块组件
 * 用于渲染单个分类的链接列表
 * @param category - 分类标题
 * @param links - 链接列表
 */
import React from 'react';
import { Typography } from 'antd';
import { FooterLink } from './FooterLink';
import styles from './Footer.module.css';

const { Title } = Typography;

interface FooterSectionProps {
    category: string;
    links: string[];
}

export const FooterSection: React.FC<FooterSectionProps> = ({ category, links }) => {
    return (
        <div className={styles.section}>
            <Title level={5}>{category}</Title>
            <div className={styles.linkList}>
                {links.map(link => (
                    <FooterLink key={link} text={link} />
                ))}
            </div>
        </div>
    );
}; 