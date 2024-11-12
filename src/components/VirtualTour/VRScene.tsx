import { FC, useEffect, useRef, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, PhotoDome, PointerEventTypes } from '@babylonjs/core';
import { message } from 'antd';
import styles from './VirtualTour.module.css';

interface VRSceneProps {
  imageUrl: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const VRScene: FC<VRSceneProps> = ({ imageUrl, canvasRef }) => {
  const [, setIsFPSMode] = useState(false);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (type: 'success' | 'error' | 'info', content: string) => {
    messageApi.open({
      type,
      content
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // 初始化引擎和场景
      engineRef.current = new Engine(canvasRef.current, true);
      sceneRef.current = new Scene(engineRef.current);

      // 设置相机
      const camera = new ArcRotateCamera(
        'camera',
        0,
        Math.PI / 2,
        1,
        Vector3.Zero(),
        sceneRef.current
      );
      cameraRef.current = camera;

      // 配置相机
      camera.minZ = 0.1;
      camera.fov = 1.0;
      camera.wheelPrecision = 50;
      camera.lowerBetaLimit = 0.1;
      camera.upperBetaLimit = Math.PI - 0.1;
      camera.inertia = 0;
      camera.angularSensibilityX = 2000;
      camera.angularSensibilityY = 2000;
      camera.panningSensibility = 0;

      // 创建全景图
      const photoDome = new PhotoDome(
        'photoDome',
        imageUrl,
        {
          resolution: 32,
          size: 1000
        },
        sceneRef.current
      );

      // 监听全景图加载完成事件
      photoDome.onReady = () => {
        showMessage('success', '全景加载成功');
      };

      // 监听全景图加载失败事件
      photoDome.onLoadErrorObservable.add((error) => {
        console.error('全景加载失败:', error);
        showMessage('error', '全景加载失败');
      });

      // 添加场景事件监听
      sceneRef.current.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERMOVE && document.pointerLockElement) {
          const event = pointerInfo.event as MouseEvent;
          const deltaX = event.movementX * 0.0004;
          const deltaY = event.movementY * 0.0004;
          
          camera.alpha = camera.alpha - deltaX;
          camera.beta = Math.max(
            camera.lowerBetaLimit ?? 0.1,
            Math.min(camera.upperBetaLimit ?? Math.PI - 0.1, camera.beta - deltaY)
          );
        }
      });

      // 渲染循环
      engineRef.current.runRenderLoop(() => {
        sceneRef.current?.render();
      });

      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        engineRef.current?.resize();
      });

    } catch (error) {
      console.error('场景初始化失败:', error);
      showMessage('error', '场景初始化失败');
    }

    return () => {
      engineRef.current?.dispose();
      sceneRef.current?.dispose();
    };
  }, [imageUrl]);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsFPSMode(!!document.pointerLockElement);
      if (!document.pointerLockElement) {
        document.body.style.cursor = 'auto';
      } else {
        document.body.style.cursor = 'none';
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const handleMouseEnter = async () => {
    if (canvasRef.current) {
      try {
        showMessage('info', '点击画面进入自由视角模式');
      } catch (error) {
        console.error('无法锁定鼠标:', error);
      }
    }
  };

  const handleCanvasClick = async () => {
    if (canvasRef.current) {
      try {
        await canvasRef.current.requestPointerLock();
        showMessage('info', '进入自由视角模式，按 ESC 键退出');
      } catch (error) {
        console.error('无法锁定鼠标:', error);
        showMessage('error', '无法锁定鼠标，请检查浏览器权限设置');
      }
    }
  };

  return (
    <>
      {contextHolder}
      <canvas 
        ref={canvasRef} 
        className={styles.vrCanvas}
        onMouseEnter={handleMouseEnter}
        onClick={handleCanvasClick}
      />
    </>
  );
}; 