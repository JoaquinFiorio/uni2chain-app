import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NavContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  triggerCubeAnimation: boolean;
  setTriggerCubeAnimation: (trigger: boolean) => void;
}

const defaultValue: NavContextType = {
  activeIndex: 5, // Changed default to 5 (INICIO) instead of 3 (NODOS)
  setActiveIndex: () => {},
  triggerCubeAnimation: false,
  setTriggerCubeAnimation: () => {},
};

const NavContext = createContext<NavContextType>(defaultValue);

export const useNavContext = () => useContext(NavContext);

interface NavProviderProps {
  children: ReactNode;
}

export const NavProvider: React.FC<NavProviderProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState<number>(5);
  const [triggerCubeAnimation, setTriggerCubeAnimation] = useState<boolean>(false);

  return (
    <NavContext.Provider 
      value={{ 
        activeIndex, 
        setActiveIndex, 
        triggerCubeAnimation, 
        setTriggerCubeAnimation 
      }}
    >
      {children}
    </NavContext.Provider>
  );
};