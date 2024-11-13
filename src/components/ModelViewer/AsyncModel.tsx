import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {useGLTF} from '@react-three/drei';

interface ModelProps {
    url: string;
    onModelLoad: (model: THREE.Group) => void;
}

const AsyncModel: React.FC<ModelProps> = ({url, onModelLoad}) => {
    const {scene} = useGLTF(url);
    const modelRef = useRef(scene);

    useEffect(() => {
        if (modelRef.current) {
            modelRef.current.scale.set(2, 2, 2);
            modelRef.current.position.set(0, 0, 0);
            onModelLoad(modelRef.current);
        }
    }, [onModelLoad]);

    return <primitive object={modelRef.current}/>;
};

export default AsyncModel;