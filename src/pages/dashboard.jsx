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
  <div className="min-h-screen bg-[#111b21]"> {/* Dark background */}
    {/* Header */}
    <header className="bg-[#1a2b32] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Community Groups</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{user?.email}</span>
          <button 
            onClick={handleLogout} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1cb0f6] hover:bg-[#179ad6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1cb0f6]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Create Group Section */}
      <div className="bg-[#1a2b32] rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-white mb-4">Create a New Community Group</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="block w-full rounded-md border-gray-700 bg-[#233b44] text-white shadow-sm focus:border-[#58cc02] focus:ring-[#58cc02] sm:text-sm focus:ring-transparent"
          />
          <textarea
            placeholder="Group Description"
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            className="block w-full rounded-md border-gray-700 bg-[#233b44] text-white shadow-sm focus:border-[#58cc02] focus:ring-[#58cc02] sm:text-sm focus:ring-transparent"
            rows={3}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="openGroup"
              checked={newGroup.isOpen}
              onChange={(e) => setNewGroup({ ...newGroup, isOpen: e.target.checked })}
              className="h-4 w-4 text-[#58cc02] focus:ring-[#58cc02] border-gray-700 rounded focus:border-transparent"
            />
            <label htmlFor="openGroup" className="ml-2 block text-sm text-gray-300">
              Open Group (Anyone can join)
            </label>
          </div>
          <button 
            onClick={createGroup} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#58cc02] hover:bg-[#46a102] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#58cc02]"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-[#1a2b32] rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white">All Groups</h2>
        </div>
        <ul className="divide-y divide-gray-700">
          {groups.map((group) => (
            <li key={group.id} className="p-6 hover:bg-[#233b44] transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">{group.description}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span>Created by: {group.created_by}</span>
                    {group.is_open && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#58cc02] text-white">
                        Open Group
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {group.isMember ? (
                    <>
                      <button
                        onClick={() => router.push(`/groups/${group.id}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1cb0f6] hover:bg-[#179ad6]"
                      >
                        Enter Chat
                      </button>
                      <button
                        onClick={() => leaveGroup(group.id)}
                        className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-[#233b44]"
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#58cc02] hover:bg-[#46a102]"
                    >
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  </div>
);
};
export default Dashboard;

