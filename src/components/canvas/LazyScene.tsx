'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

export default function LazyScene() {
    return <Scene />;
}
