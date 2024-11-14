import {Card, Col, Row, Typography} from 'antd';
import type {FC} from 'react';
import styles from './Features.module.css';
import {FEATURES} from '../constants';
import type {Feature} from '../types';

const {Title, Paragraph} = Typography;

const Features: FC = () => {
    return (
        <section className={styles.features}>
            <Row gutter={[32, 32]} justify="center">
                {FEATURES.map((feature: Feature, index: number) => (
                    <Col xs={24} sm={8} key={index}>
                        <Card className={styles.featureCard}>
                            {feature.icon}
                            <Title level={3}>{feature.title}</Title>
                            <Paragraph>{feature.description}</Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default Features; 