import React from 'react';
import EmployeeDetail from '../components/EmployeeDetail';
import type { EmployeeDetailConfig } from '../components/EmployeeDetail';

const config: EmployeeDetailConfig = {
  theme: 'dylan-theme',
  eyebrow: 'Lumon Industries — Macrodata Refinement',
  firstName: 'Dylan',
  lastName: 'George',
  role: 'MDR · Refiner',
  fileNo: '104',
  frames: [
    {
      src: '/assets/Dylan1/Severance27.jpeg',
      alt: 'Dylan George — portrait',
      title: 'Dylan George',
      sub: 'Outie · Portrait',
    },
    {
      src: '/assets/Dylan2/Severance22.jpg',
      alt: 'Macrodata Refinement floor',
      title: 'Macrodata Refinement',
      sub: 'The Refining Floor',
    },
    {
      src: '/assets/Dylan3/Severance134.avif',
      alt: 'Lumon corridors',
      title: 'Corridors',
      sub: 'Lumon Hallways',
    },
    {
      src: '/assets/Dylan4/Severance136.avif',
      alt: 'Dylan George — severed',
      title: 'Dylan George',
      sub: 'Innie · Severed',
    },
  ],
};

const DylanDetailPage: React.FC = () => <EmployeeDetail config={config} />;

export default DylanDetailPage;
