import {Button, Typography} from 'antd';
import {RocketOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import styles from './Hero.module.css';

const {Title, Paragraph} = Typography;

const Hero: React.FC = () => {
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate('/destinations');
    };

    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <Title level={1}>探索世界文化遗产的新方式</Title>
                <Paragraph>
                    借助AR/VR技术，在家即可开启沉浸式文化之旅。
                    足不出户，感受全球文化遗产的独特魅力。
                </Paragraph>
                <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined/>}
                    onClick={handleExplore}
                >
                    开始体验
                </Button>
            </div>
        </section>
    );
};

export default Hero; 