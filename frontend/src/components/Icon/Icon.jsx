import React from 'react';
import { icons } from '../icons/index';

const Icon = ({ name, size = "14px", className = '' }) => {
    const SvgIcon = icons[name];

    if (!SvgIcon) return null;

    return <SvgIcon width={size} height={size} className={className} />;
};

export default Icon;