'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

const HEIGHT = 60;
const WIDTH = 60;

export interface LogoProps {
  height?: number;
  width?: number;
}

export function Logo({ height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  const url = '/assets/admin-logo.png';

  return <Box alt="logo" component="img" height={height} src={url} width={width} />;
}

export interface DynamicLogoProps {
  height?: number;
  width?: number;
}

export function DynamicLogo({
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  return (
    <Logo height={height} width={width} {...props} />
  );
}
