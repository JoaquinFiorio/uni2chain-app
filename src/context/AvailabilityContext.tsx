import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export interface NodeAvailability {
  id: number;
  name: string;
  total: number;
  sold: number;
  available: number;
}

interface AvailabilityContextType {
  nodesAvailability: NodeAvailability[];
  loading: boolean;
  refreshAvailability: () => Promise<void>;
}

const AvailabilityContext = createContext<AvailabilityContextType>({
  nodesAvailability: [],
  loading: false,
  refreshAvailability: async () => {},
});

export const useAvailabilityContext = () => useContext(AvailabilityContext);

export const AvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [nodesAvailability, setNodesAvailability] = useState<NodeAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/nodes/availability`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data && res.data.success) {
        setNodesAvailability(res.data.nodes);
      }
    } catch (err) {
      setNodesAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <AvailabilityContext.Provider value={{ nodesAvailability, loading, refreshAvailability: fetchAvailability }}>
      {children}
    </AvailabilityContext.Provider>
  );
};
