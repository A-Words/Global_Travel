/**
 * 页脚内容组件
 * 负责渲染页脚的主要内容，包括链接分类和版权信息
 * 使用 Ant Design 的 Row 和 Col 组件实现响应式布局
 */
import React from 'react';
import { Row, Col } from 'antd';
import { FooterSection } from './FooterSection';
import { FooterCopyright } from './FooterCopyright';
import styles from './Footer.module.css';

export const FooterContent: React.FC = () => {
    // 页脚链接数据配置
    const footerLinks = {
        关于我们: ['公司介绍', '联系方式', '加入我们', '新闻中心'],
        帮助中心: ['常见问题', '安全指南', '隐私政策', '用户协议'],
        商务合作: ['景点合作', '广告投放', '战略合作', '品牌授权'],
        关注我们: ['微信', '微博', '抖音', 'Instagram']
    };

    return (
        <div className={styles.container}>
            <div className={styles.linksContainer}>
                <Row gutter={[64, 32]} justify="space-around">
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Col key={category} xs={12} sm={12} md={6}>
                            <FooterSection category={category} links={links} />
                        </Col>
                    ))}
                </Row>
            </div>
            <FooterCopyright />
        </div>
    );
}; 