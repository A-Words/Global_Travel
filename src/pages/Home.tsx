import React from 'react';
import { Layout, Typography, Button, Row, Col, Card } from 'antd';
import { RocketOutlined, GlobalOutlined, CompassOutlined } from '@ant-design/icons';
import './Home.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Content className="home-content">
      {/* 英雄区域 */}
      <section className="hero">
        <div className="hero-content">
          <Title level={1}>探索世界文化遗产的新方式</Title>
          <Paragraph>
            借助AR/VR技术，在家即可开启沉浸式文化之旅。
            足不出户，感受全球文化遗产的独特魅力。
          </Paragraph>
          <Button type="primary" size="large" icon={<RocketOutlined />}>
            开始体验
          </Button>
        </div>
      </section>

      {/* 特色功能区 */}
      <section className="features">
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={8}>
            <Card className="feature-card">
              <GlobalOutlined className="feature-icon" />
              <Title level={3}>VR虚拟游览</Title>
              <Paragraph>
                通过VR技术，360°全景体验世界各地的文化遗产，
                仿佛身临其境。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="feature-card">
              <CompassOutlined className="feature-icon" />
              <Title level={3}>AR实景导览</Title>
              <Paragraph>
                增强现实技术为您提供丰富的文化解说，
                了解每一处遗迹背后的历史故事。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="feature-card">
              <RocketOutlined className="feature-icon" />
              <Title level={3}>智能行程规划</Title>
              <Paragraph>
                基于AI算法，为您量身定制最优旅行路线，
                打造专属文化之旅。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      {/* 热门目的地 */}
      <section className="destinations">
        <Title level={2} className="section-title">
          热门文化遗产目的地
        </Title>
        <Row gutter={[24, 24]}>
          {['长城', '埃及金字塔', '泰姬陵', '圣家族大教堂'].map((site) => (
            <Col key={site} xs={24} sm={12} md={6}>
              <Card
                hoverable
                cover={<div className="destination-image" data-site={site} />}
                className="destination-card"
              >
                <Card.Meta title={site} description="点击开启VR之旅" />
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Content>
  );
};

export default Home;