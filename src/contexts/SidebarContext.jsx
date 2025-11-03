import { useState } from 'react';
import { SidebarContext } from './Sidebar';



export const SidebarProvider = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
