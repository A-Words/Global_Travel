import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';
import Home from '../pages/Home';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'virtual-tour',
                element: lazy(() => import('@/features/tour/VirtualTour')),
                loader: () => import('@/features/tour/loader')
            }
        ]
    }
];

export default routes; 