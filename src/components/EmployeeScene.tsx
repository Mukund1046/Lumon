
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useGLTF, Environment, Sparkles } from '@react-three/drei';
import { Mesh } from 'three';
import { cn } from '@/lib/utils';

interface Employee {
  name: string;
  position: string;
  quote: string;
  image: string;
  color: string;
}

interface EmployeeBoxProps {
  position: [number, number, number];
  employee: Employee;
  onClick: () => void;
}

// Box representing an employee
const EmployeeBox: React.FC<EmployeeBoxProps> = ({ position, employee, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={employee.color} 
          metalness={0.5}
          roughness={0.2}
          emissive={hovered ? employee.color : 'black'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {employee.name}
      </Text>
    </group>
  );
};

// Main 3D scene component
const EmployeeScene: React.FC<{
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  className?: string;
}> = ({ employees, onSelectEmployee, className }) => {
  return (
    <div className={cn("w-full h-[70vh]", className)}>
      <Canvas camera={{ position: [0, 2, 10], fov: 40 }}>
        <color attach="background" args={['#1A1F2C']} />
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {employees.map((employee, index) => {
          // Calculate position in circular arrangement
          const angle = (index / employees.length) * Math.PI * 2;
          const radius = 4;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          
          return (
            <EmployeeBox
              key={index}
              position={[x, 0, z]}
              employee={employee}
              onClick={() => onSelectEmployee(employee)}
            />
          );
        })}
        
        <Sparkles 
          count={100} 
          scale={10} 
          size={1} 
          speed={0.3} 
          opacity={0.5} 
          color="#9b87f5" 
        />
        <Environment preset="night" />
        <OrbitControls 
          enableZoom={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default EmployeeScene;
