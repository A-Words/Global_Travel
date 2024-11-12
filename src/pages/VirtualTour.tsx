import { FC, useState, useRef, useEffect } from 'react';
import { Layout, Card, Select, Button, Space, Typography, Row, Col, message, theme } from 'antd';
import { FullscreenOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { VRScene } from '../components/VirtualTour/VRScene';
import styles from '../components/VirtualTour/VirtualTour.module.css';

const { Content } = Layout;
const { Title } = Typography;

const tourSpots = [
  { label: '长城', value: '/assets/panoramas/great-wall.jpg' },
  { label: '埃及金字塔', value: '/assets/panoramas/pyramids.jpg' },
  { label: '泰姬陵', value: '/assets/panoramas/taj-mahal.jpg' },
  { label: '圣家族大教堂', value: '/assets/panoramas/sagrada-familia.jpg' },
];

const VirtualTour: FC = () => {
  const [currentSpot, setCurrentSpot] = useState(tourSpots[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [setIsFullscreen] = useState(false);
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { token } = theme.useToken();
  const [messageApi] = message.useMessage();

  const showMessage = (type: 'success' | 'error' | 'info', content: string) => {
    messageApi.open({
      type,
      content,
      className: token.colorBgContainer === '#ffffff' ? styles.lightMessage : styles.darkMessage
    });
  };

  const handleSpotChange = (value: string) => {
    setIsLoading(true);
    setCurrentSpot(value);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // 添加全屏变化事件监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        if (canvasRef.current) {
          canvasRef.current.requestPointerLock();
        }
      } else {
        setIsFullscreen(false);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && sceneContainerRef.current) {
      try {
        await sceneContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('无法进入全屏:', error);
        showMessage('error', '无法进入全屏模式');
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <Content className={styles.content}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className={styles.header}>
                <Title level={4}>VR虚拟旅游</Title>
                <Space>
                  <Select
                    value={currentSpot}
                    onChange={handleSpotChange}
                    options={tourSpots}
                    style={{ width: 200 }}
                  />
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => handleSpotChange(currentSpot)}
                  >
                    重新加载
                  </Button>
                  <Button 
                    icon={<FullscreenOutlined />}
                    onClick={toggleFullscreen}
                  >
                    全屏
                  </Button>
                </Space>
              </div>
              
              <div 
                ref={sceneContainerRef} 
                className={styles.sceneContainer}
              >
                {isLoading ? (
                  <div className={styles.loading}>
                    <LoadingOutlined />
                    <span>场景加载中...</span>
                  </div>
                ) : (
                  <VRScene 
                    imageUrl={currentSpot} 
                    canvasRef={canvasRef}
                  />
                )}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default VirtualTour; 