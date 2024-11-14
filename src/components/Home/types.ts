import {ReactElement} from 'react';
import {AntdIconProps} from '@ant-design/icons/lib/components/AntdIcon';

export interface Feature {
    icon: ReactElement<AntdIconProps>;
    title: string;
    description: string;
}

export interface Destination {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    hasVR?: boolean;
    hasAR?: boolean;
}

export interface VisitingInfo {
    bestTime: string;
    duration: string;
    ticketPrice: string;
}

export interface Heritage extends Destination {
    visitingInfo?: VisitingInfo;
    location?: string;
    category?: string[];
}