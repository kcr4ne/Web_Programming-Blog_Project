import { useContext } from 'react';
import { SidebarContext } from '../contexts/Sidebar';

export const useSidebar = () => useContext(SidebarContext);
