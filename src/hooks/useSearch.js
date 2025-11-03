import { useContext } from 'react';
import { SearchContext } from '../contexts/Search';

export const useSearch = () => useContext(SearchContext);
