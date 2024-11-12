import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, message, Tooltip } from 'antd';
import { 
  MobileOutlined, 
  EyeOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  RotateRightOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import ARModelViewer from './ARModelViewer';
import styles from './ModelViewer.module.css';

interface ModelViewerProps {
  modelUrl: string;
  title?: string;
}

function Model({ url, onModelLoad }: { url: string; onModelLoad: (model: THREE.Group) => void }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef(scene);
  
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(2, 2, 2);
      modelRef.current.position.set(0, 0, 0);
      onModelLoad(modelRef.current);
    }
  }, [onModelLoad]);

  return <primitive object={modelRef.current} />;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, title }) => {
  const [isARMode, setIsARMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modelRef = useRef<THREE.Group>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isARSupported, setIsARSupported] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const supported = await (navigator as any).xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
        } catch (error) {
          setIsARSupported(false);
        }
      }
    };
    checkARSupport();
  }, []);

  const handleARView = async () => {
    if (isARSupported) {
      try {
        const session = await (navigator as any).xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body }
        });
        
        messageApi.success('AR 模式已启动');
        setIsARMode(true);
        
        session.addEventListener('end', () => {
          setIsARMode(false);
          messageApi.info('已退出 AR 模式');
        });
      } catch (error) {
        messageApi.error('AR 启动失败，请确保在支持的设备和浏览器中使用');
      }
    } else {
      messageApi.error('您的设备不支持 AR 功能');
    }
  };

  const handleModelLoad = (model: THREE.Group) => {
    modelRef.current = model;
  };

  const handleZoomIn = () => {
    if (modelRef.current) {
      const newScale = modelRef.current.scale.clone().multiplyScalar(1.2);
      modelRef.current.scale.copy(newScale);
    }
  };

  const handleZoomOut = () => {
    if (modelRef.current) {
      const newScale = modelRef.current.scale.clone().multiplyScalar(0.8);
      modelRef.current.scale.copy(newScale);
    }
  };

  const handleRotate = () => {
    if (modelRef.current) {
      modelRef.current.rotation.y += Math.PI / 4;
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        messageApi.error('无法进入全屏模式');
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Card 
        title={title || "3D 模型预览"} 
        className={styles.modelViewer}
        extra={
            <Space>
            <Button 
              icon={<EyeOutlined />} 
              type={!isARMode ? "primary" : "default"}
              onClick={() => setIsARMode(false)}
            >
              3D 预览
            </Button>
            <Button 
              icon={<MobileOutlined />}
              type={isARMode ? "primary" : "default"}
              onClick={handleARView}
              disabled={!isARSupported}
            >
              AR 预览
            </Button>
          </Space>
        }
      >
        <div ref={containerRef} className={styles.viewerContainer}>
          {isARMode ? (
            <ARModelViewer modelUrl={modelUrl} />
          ) : (
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              <Model url={modelUrl} onModelLoad={handleModelLoad} />
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={false}
              />
            </Canvas>
          )}
          <div className={styles.controls}>
            <Space size={8}>
              <Tooltip title="放大" placement="top">
                <Button 
                  type="default"
                  icon={<ZoomInOutlined />} 
                  onClick={handleZoomIn}
                />
              </Tooltip>
              <Tooltip title="缩小" placement="top">
                <Button 
                  type="default"
                  icon={<ZoomOutOutlined />} 
                  onClick={handleZoomOut}
                />
              </Tooltip>
              <Tooltip title="旋转" placement="top">
                <Button 
                  type="default"
                  icon={<RotateRightOutlined />} 
                  onClick={handleRotate}
                />
              </Tooltip>
              <Tooltip title={isFullscreen ? "退出全屏" : "全屏"} placement="top">
                <Button 
                  type="default"
                  icon={<FullscreenOutlined />} 
                  onClick={toggleFullscreen}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ModelViewer;