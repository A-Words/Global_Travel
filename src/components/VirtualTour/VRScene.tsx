import {FC, useEffect, useRef, useState} from 'react';
import type {ArcRotateCamera, Engine, Scene} from '@babylonjs/core';
import {message} from 'antd';
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

    let cleanup: (() => void) | undefined;

    const initScene = async () => {
      try {
          // 按需导入具体模块
          const {Engine} = await import('@babylonjs/core/Engines/engine');
          const {Scene} = await import('@babylonjs/core/scene');
          const {ArcRotateCamera} = await import('@babylonjs/core/Cameras/arcRotateCamera');
          const {Vector3} = await import('@babylonjs/core/Maths/math.vector');
          const {PhotoDome} = await import('@babylonjs/core/Helpers/photoDome');
          const {PointerEventTypes} = await import('@babylonjs/core/Events/pointerEvents');

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
        camera.wheelPrecision = 100;
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = Math.PI - 0.1;
        camera.inertia = 0;  // 移除惯性
        camera.angularSensibilityX = 400;
        camera.angularSensibilityY = 400;
        camera.panningSensibility = 0;
        camera.speed = 4;

        // 创建全景图
          const photoDome = new PhotoDome(
            'photoDome',
            imageUrl,
            {
              resolution: 64,  // 提高分辨率
              size: 1000,
              useDirectMapping: true,  // 使用直接映射提高性能
            },
            sceneRef.current
        );

        // 设置场景优化选项
        sceneRef.current.autoClear = false; // 禁用自动清除
        sceneRef.current.autoClearDepthAndStencil = false;
        sceneRef.current.skipFrustumClipping = true;

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
        let lastTime = 0;
        const moveThreshold = 16; // 约60fps的间隔
        let lastDeltaX = 0;
        let lastDeltaY = 0;
        const maxDelta = 0.1; // 限制最大移动量
        
        sceneRef.current.onPointerObservable.add((pointerInfo) => {
          if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
            const currentTime = performance.now();
            if (currentTime - lastTime < moveThreshold) {
              return;
            }
            lastTime = currentTime;
            
            const event = pointerInfo.event as PointerEvent;
            const isTouchEvent = event.pointerType === 'touch';
            const sensitivity = isTouchEvent ? 0.008 : 0.003;

            // 计算移动增量
            let deltaX = event.movementX * sensitivity;
            let deltaY = event.movementY * sensitivity;

            // 限制突变
            deltaX = Math.max(-maxDelta, Math.min(maxDelta, deltaX));
            deltaY = Math.max(-maxDelta, Math.min(maxDelta, deltaY));

            // 平滑突变
            deltaX = (deltaX + lastDeltaX) / 2;
            deltaY = (deltaY + lastDeltaY) / 2;

            lastDeltaX = deltaX;
            lastDeltaY = deltaY;
            
            if (isTouchEvent || document.pointerLockElement) {
              camera.alpha -= deltaX;
              camera.beta = Math.max(
                  camera.lowerBetaLimit ?? 0.1,
                  Math.min(camera.upperBetaLimit ?? Math.PI - 0.1, camera.beta - deltaY)
              );
            }
          }
        });

        // 渲染循环
        engineRef.current.runRenderLoop(() => {
          if (sceneRef.current && !sceneRef.current.isDisposed) {
            sceneRef.current.render(true, true);
          }
        });

        // 响应窗口大小变化
        window.addEventListener('resize', () => {
          engineRef.current?.resize();
        });

        cleanup = () => {
          engineRef.current?.dispose();
          sceneRef.current?.dispose();
        };
      } catch (error) {
        console.error('场景初始化失败:', error);
        showMessage('error', '场景初始化失败');
      }
    };

    initScene();

    return () => cleanup?.();
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
        onTouchStart={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
      />
    </>
  );
}; 