import React from 'react';
import EmployeeDetail from '../components/EmployeeDetail';
import type { EmployeeDetailConfig } from '../components/EmployeeDetail';

const config: EmployeeDetailConfig = {
  theme: 'irving-theme',
  eyebrow: 'Lumon Industries — Macrodata Refinement',
  firstName: 'Irving',
  lastName: 'Bailiff',
  role: 'MDR · Refiner',
  fileNo: '103',
  frames: [
    {
      src: '/assets/Irving1/Severance21.jpg',
      alt: 'Irving Bailiff — portrait',
      title: 'Irving Bailiff',
      sub: 'Outie · Portrait',
    },
    {
      src: '/assets/Irving2/Severance22.jpg',
      alt: 'Macrodata Refinement floor',
      title: 'Macrodata Refinement',
      sub: 'The Refining Floor',
    },
    {
      src: '/assets/Irving3/Severance63.jpg',
      alt: 'Lumon corridors',
      title: 'Corridors',
      sub: 'Lumon Hallways',
    },
    {
      src: '/assets/Irving4/Severance74.jpg',
      alt: 'Irving Bailiff — severed',
      title: 'Irving Bailiff',
      sub: 'Innie · Severed',
    },
  ],
};

const IrvingDetailPage: React.FC = () => <EmployeeDetail config={config} />;

export default IrvingDetailPage;
