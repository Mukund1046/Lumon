
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <div className="sticky z-0 bottom-0 left-0 w-full h-80 bg-severance-midnight flex justify-center items-center">
      <div className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12 text-severance-slate">
        <div className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl">
          <ul className="space-y-3">
            <li className="text-severance-frost">
              <Link to="/">
                <span className="font-jetbrains-mono hover:underline">Home</span>
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/about">
                <span className="font-jetbrains-mono hover:underline">About</span>
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/departments">
                <span className="font-jetbrains-mono hover:underline">Departments</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="text-severance-frost">
              <Link to="/employees">
                <span className="font-jetbrains-mono hover:underline">Employees</span>
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/join-us">
                <span className="font-jetbrains-mono hover:underline">Join Us</span>
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/privacy">
                <span className="font-jetbrains-mono hover:underline">Privacy</span>
              </Link>
            </li>
          </ul>
        </div>
        <div aria-hidden="true" className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] text-severance-slate font-trap font-bold opacity-70">
          LUMON
        </div>
      </div>
    </div>
  );
};

export default Footer;
