import { useApp as useAppContext } from '../store/AppContext';

export function useApp() {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
}

export default useApp;