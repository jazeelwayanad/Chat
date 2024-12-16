import { useEffect, useState } from 'react';
import { fetchGroups } from '../../utils/chatHelpers';

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      const groupsData = await fetchGroups();
      setGroups(groupsData);
    };
    fetchGroupData();
  }, []);

  return (
    <div>
      <h2>Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
