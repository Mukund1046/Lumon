import React from 'react';
import EmployeeDetail from '../components/EmployeeDetail';
import type { EmployeeDetailConfig } from '../components/EmployeeDetail';

const config: EmployeeDetailConfig = {
  theme: 'mark-theme',
  eyebrow: 'Lumon Industries — Macrodata Refinement',
  firstName: 'Mark',
  lastName: 'Scout',
  role: 'MDR · Team Lead',
  fileNo: '101',
  frames: [
    {
      src: '/assets/Mark1/Severance1.jpeg',
      alt: 'Mark Scout — portrait',
      title: 'Mark Scout',
      sub: 'Outie · Portrait',
    },
    {
      src: '/assets/Mark2/Severance11.jpg',
      alt: 'Macrodata Refinement floor',
      title: 'Macrodata Refinement',
      sub: 'The Refining Floor',
    },
    {
      src: '/assets/Mark3/Severance14.jpg',
      alt: 'Lumon corridors',
      title: 'Corridors',
      sub: 'Lumon Hallways',
    },
    {
      src: '/assets/Mark4/Severance55.jpg',
      alt: 'Mark Scout — severed',
      title: 'Mark Scout',
      sub: 'Innie · Severed',
    },
  ],
};

const MarkDetailPage: React.FC = () => <EmployeeDetail config={config} />;

export default MarkDetailPage;
