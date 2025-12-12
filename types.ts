import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface SectionProps {
  className?: string;
  id?: string;
}

export interface JitterItemProps {
  text: string;
  x: number;
  y: number;
  delay: number;
  type: 'neutral' | 'threat' | 'safe';
}

export interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  positive?: boolean;
}
