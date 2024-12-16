import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isOpen: false });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchGroups();
  }, [user, loading]);

  // Fetch all groups along with their membership status
  const fetchGroups = async () => {
    if (!user) return;

    const { data: groupsData, error: groupsError } = await supabase
      .from('groups')
      .select('id, name, description, created_at, created_by, is_open');

    if (groupsError) {
      console.error('Error fetching groups:', groupsError.message);
      return;
    }

    const groupsWithMembership = await Promise.all(
      groupsData.map(async (group) => {
        if (group.is_open) {
          group.isMember = true; // Treat all users as members for open groups
          return group;
        }

        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select('user_id')
          .eq('group_id', group.id);

        if (membersError) {
          console.error(`Error fetching members for group ${group.id}:`, membersError.message);
          return group;
        }

        group.isMember = membersData.some((member) => member.user_id === user.id);
        return group;
      })
    );

    setGroups(groupsWithMembership);
  };

  // Join a group
  const joinGroup = async (groupId) => {
    if (!user) return;

    const { error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: user.id }]);

    if (error) {
      console.error('Error joining group:', error.message);
    } else {
      fetchGroups();
    }
  };

  // Leave a group
  const leaveGroup = async (groupId) => {
    if (!user) return;

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error leaving group:', error.message);
    } else {
      fetchGroups();
    }
  };

  // Create a new group
  const createGroup = async () => {
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }

    const { name, description, isOpen } = newGroup;

    const { error } = await supabase
      .from('groups')
      .insert([{ name, description, created_by: user.id, is_open: isOpen }]);

    if (error) {
      console.error('Error creating group:', error.message);
    } else {
      setNewGroup({ name: '', description: '', isOpen: false });
      fetchGroups();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user?.email}!</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={newGroup.name}
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <textarea
          placeholder="Group Description"
          value={newGroup.description}
          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={newGroup.isOpen}
              onChange={(e) => setNewGroup({ ...newGroup, isOpen: e.target.checked })}
            />
            Open Group
          </label>
        </div>
        <button onClick={createGroup} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Group
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Groups</h2>
        <ul>
          {groups.map((group) => (
            <li key={group.id} className="border p-4 mb-2 rounded bg-white shadow">
              <h3 className="text-xl font-bold">{group.name}</h3>
              <p>{group.description}</p>
              <p className="text-sm text-gray-500">
                Created by: {group.created_by} {group.is_open && '(Open Group)'}
              </p>
              {group.isMember ? (
                <>
                  <button
                    onClick={() => router.push(`/groups/${group.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Enter Chat
                  </button>
                  <button
                    onClick={() => leaveGroup(group.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
                  >
                    Leave Group
                  </button>
                </>
              ) : (
                <button
                  onClick={() => joinGroup(group.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                  Join Group
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
