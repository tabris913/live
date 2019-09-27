import * as React from 'react';

export const useCounter = (defaultValue?: number) => React.useState(defaultValue || 0);

export const useColor = (defaultColor?: string) => React.useState(defaultColor || '#fff');
