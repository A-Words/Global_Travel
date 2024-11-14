import {Card, Col, Row, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import type {FC} from 'react';
import styles from './Destinations.module.css';
import {DESTINATIONS} from '../constants';
import type {Destination} from '../types';

const {Title} = Typography;

const Destinations: FC = () => {
    const navigate = useNavigate();

    const handleCardClick = (id: string): void => {
        navigate(`/heritage/${id}`);
    };

    return (
        <section className={styles.destinations}>
            <Title level={2} className={styles.sectionTitle}>
                热门文化遗产目的地
            </Title>
            <Row gutter={[24, 24]}>
                {DESTINATIONS.map((destination: Destination) => (
                    <Col key={destination.id} xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            cover={
                                <div
                                    className={styles.destinationImage}
                                    style={{backgroundImage: `url(${destination.imageUrl})`}}
                                />
                            }
                            className={styles.destinationCard}
                            onClick={() => handleCardClick(destination.id)}
                        >
                            <Card.Meta
                                title={destination.name}
                                description={destination.description}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default Destinations; 