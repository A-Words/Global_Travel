import React, { useEffect, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ARModelViewerProps {
  modelUrl: string;
}

const ARModelViewer: React.FC<ARModelViewerProps> = ({ modelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    let currentSession: any = null;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    
    const init = async () => {
      try {
        // 检查 AR 支持
        if (!navigator.xr) {
          throw new Error('WebXR 不支持');
        }

        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!isSupported) {
          throw new Error('设备不支持 AR');
        }

        // 初始化 Three.js
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        
        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement);
        }

        // 加载 3D 模型
        const loader = new GLTFLoader();
        loader.load(modelUrl, 
          (gltf) => {
            const model = gltf.scene;
            // 调整模型大小和位置
            model.scale.set(0.1, 0.1, 0.1);
            model.position.set(0, 0, -0.5);
            scene.add(model);
            setIsLoading(false);
          },
          undefined,
          (error) => {
            console.error('模型加载失败:', error);
            message.error('模型加载失败');
          }
        );

        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);

        // 开始 AR 会话
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
        });

        currentSession = session;
        
        // 设置 XR 动画循环
        renderer.setAnimationLoop((timestamp, frame) => {
          if (!frame) return;

          const referenceSpace = renderer.xr.getReferenceSpace();
          if (referenceSpace) {
            // 更新场景
            renderer.render(scene, camera);
          }
        });

        session.addEventListener('end', () => {
          renderer.setAnimationLoop(null);
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
        });

      } catch (error) {
        message.error((error as Error).message);
        console.error(error);
      }
    };

    init();

    // 清理函数
    return () => {
      if (currentSession) {
        currentSession.end();
      }
      if (containerRef.current && renderer?.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  // 添加 AR 放置指引
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {isLoading ? (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)'
        }}>
          <LoadingOutlined style={{ fontSize: 24 }} /> 加载中...
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#fff',
          padding: '10px',
          background: 'rgba(0,0,0,0.5)',
        }}>
          点击屏幕放置模型，双指缩放调整大小
        </div>
      )}
    </div>
  );
};

export default ARModelViewer; 