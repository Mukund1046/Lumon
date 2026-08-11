import React from 'react';
import EmployeeDetail from '../components/EmployeeDetail';
import type { EmployeeDetailConfig } from '../components/EmployeeDetail';

const config: EmployeeDetailConfig = {
  theme: 'helly-theme',
  eyebrow: 'Lumon Industries — Macrodata Refinement',
  firstName: 'Helly',
  lastName: 'R.',
  role: 'MDR · Refiner',
  fileNo: '102',
  frames: [
    {
      src: '/assets/Helly1/Severance31.jpeg',
      alt: 'Helly R. — portrait',
      title: 'Helly R.',
      sub: 'Outie · Portrait',
    },
    {
      src: '/assets/Helly2/Severance23.jpg',
      alt: 'Macrodata Refinement floor',
      title: 'Macrodata Refinement',
      sub: 'The Refining Floor',
    },
    {
      src: '/assets/Helly3/Severance102.jpg',
      alt: 'Lumon corridors',
      title: 'Corridors',
      sub: 'Lumon Hallways',
    },
    {
      src: '/assets/Helly4/Severance127.jpg',
      alt: 'Helly R. — severed',
      title: 'Helly R.',
      sub: 'Innie · Severed',
    },
  ],
};

const HellyDetailPage: React.FC = () => <EmployeeDetail config={config} />;

export default HellyDetailPage;
