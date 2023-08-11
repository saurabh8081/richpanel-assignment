import React from 'react';
import Image from 'next/image';

const Loader = () => {
    return (
        <div className='fixed inset-0 z-50 bg-white w-full h-full flex items-center justify-center'>
        <div id="container">
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <Image className='relative -z-10 right-[0.35rem] bottom-[0.5rem]' src='/ifacet logo-JPG.jpg' width={100} height={100} />
        </div>
        </div>
    )
}

export default Loader;