import ModelViewer from '../components/ModelViewer';

const ModelPreview: React.FC = () => {
  return (
    <ModelViewer 
      modelUrl="/assets/models/tripo-hens_generated_by_ai.glb"
      title="产品模型预览"
    />
  );
}; 

export default ModelPreview; 