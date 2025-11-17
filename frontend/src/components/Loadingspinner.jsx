import React from "react";
import {motion as Motion} from 'framer-motion';

const Loadingspinner = ({size = 'md', className=''}) => {

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }

    return(
        <Motion.div 
            className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full ${className}`}
            animate={{rotate: 360}}
            transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
        />
    );
};

export default Loadingspinner;