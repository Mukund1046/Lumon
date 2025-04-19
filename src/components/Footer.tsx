
import React from 'react';
import { Link } from 'react-router-dom';
import { GooeyText } from '@/components/ui/gooey-text';
import { ArrowUp } from 'lucide-react';
import ComesInGoesOutUnderline from '@/fancy/components/text/underline-comes-in-goes-out';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Employees', path: '/employees' },
    { name: 'Join Us', path: '/join-us' },
  ];

  return (
    <div className="sticky z-0 bottom-0 left-0 w-full h-80 bg-severance-midnight flex justify-center items-center">
      <div className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12 text-severance-slate">
        <div className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl">
          <ul className="space-y-3">
            <li className="text-severance-frost">
              <Link to="/">
                <ComesInGoesOutUnderline
                  label="Home"
                  className="font-jetbrains-mono"
                  underlineHeightRatio={0.08}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/about">
                <ComesInGoesOutUnderline
                  label="About"
                  className="font-jetbrains-mono"
                  underlineHeightRatio={0.08}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/departments">
                <ComesInGoesOutUnderline
                  label="Departments"
                  className="font-jetbrains-mono"
                  underlineHeightRatio={0.08}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Link>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="text-severance-frost">
              <Link to="/employees">
                <ComesInGoesOutUnderline
                  label="Employees"
                  className="font-jetbrains-mono"
                  underlineHeightRatio={0.08}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/join-us">
                <ComesInGoesOutUnderline
                  label="Join Us"
                  className="font-jetbrains-mono"
                  underlineHeightRatio={0.08}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Link>
            </li>
            <li className="text-severance-frost">
              <Link to="/privacy">
                <ComesInGoesOutUnderline
                  label="Privacy"
                  className="font-jetbrains-mono"
                  underlineHeightRatio={0.08}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Link>
            </li>
          </ul>
        </div>
        <h2 className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] text-severance-brass font-trap font-bold opacity-20">
          LUMON
        </h2>
      </div>
    </div>
  );
};

export default Footer;
