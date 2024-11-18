import {FC, useEffect, useRef, useState} from 'react';
import {Button, Card, Col, message, Row, Select, Space, theme, Typography} from 'antd';
import {FullscreenOutlined, ReloadOutlined} from '@ant-design/icons';
import {VRScene} from '../components/VirtualTour/VRScene';
import styles from '../components/VirtualTour/VirtualTour.module.css';
import {Loading} from '../components/Loading';
import {useLocation} from 'react-router-dom';

const { Title } = Typography;

type TourSpot = {
  label: string;
  value: string;
};

type TourSpots = {
  [key: string]: TourSpot;
};

const tourSpots: TourSpots = {
  'great-wall': {
    label: '长城',
    value: '/assets/panoramas/great-wall.webp'
  },
  'pyramids': {
    label: '埃及金字塔',
    value: '/assets/panoramas/pyramids.webp'
  },
  'taj-mahal': {
    label: '泰姬陵',
    value: '/assets/panoramas/taj-mahal.webp'
  },
  'sagrada-familia': {
    label: '圣家族大教堂',
    value: '/assets/panoramas/sagrada-familia.webp'
  }
};

const VirtualTour: FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const siteId = searchParams.get('site');

  const [currentSpot, setCurrentSpot] = useState(
      siteId && tourSpots[siteId]
          ? tourSpots[siteId].value
          : tourSpots['great-wall'].value
  );
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsFullscreen] = useState(false);
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

  const handleSpotChange = (heritageId: string) => {
    setIsLoading(true);
    setCurrentSpot(tourSpots[heritageId].value);
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
    <div className={styles.content}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className={styles.header}>
                <Title level={4}>VR虚拟旅游</Title>
                <Space>
                  <Select
                      value={Object.keys(tourSpots).find(
                          key => tourSpots[key].value === currentSpot
                      )}
                    onChange={handleSpotChange}
                      options={Object.entries(tourSpots).map(([id, spot]) => ({
                        label: spot.label,
                        value: id
                      }))}
                    style={{ width: 200 }}
                  />
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => handleSpotChange(Object.keys(tourSpots).find(
                        key => tourSpots[key].value === currentSpot
                    ) || 'great-wall')}
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
                    <Loading tip="场景加载中..."/>
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
    </div>
  );
};

export default VirtualTour; 