/**
 * 页脚链接组件
 * 渲染单个链接项，使用 react-router-dom 的 Link 组件
 * @param text - 链接文本
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterLinkProps {
    text: string;
}

export const FooterLink: React.FC<FooterLinkProps> = ({ text }) => {
    return (
        <Link to="#" className={styles.link}>
            {text}
        </Link>
    );
}; 