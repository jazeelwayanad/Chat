import { useState, useEffect } from 'react';
import { fetchGroups } from '../utils/chatHelpers';

const useGroups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      const data = await fetchGroups();
      setGroups(data);
    };
    loadGroups();
  }, []);

  return { groups };
};

export default useGroups;
