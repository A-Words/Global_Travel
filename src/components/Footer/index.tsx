/**
 * 页脚主组件
 * 使用 Ant Design 的 Layout.Footer 组件作为容器
 * 集成所有页脚相关组件
 */
import React from 'react';
import { Layout } from 'antd';
import { FooterContent } from './FooterContent';

const { Footer: AntFooter } = Layout;

export const Footer: React.FC = () => (
    <AntFooter>
        <FooterContent />
    </AntFooter>
); 