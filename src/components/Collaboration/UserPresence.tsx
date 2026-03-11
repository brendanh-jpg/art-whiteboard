import React from 'react';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function UserPresence() {
  const users = useCollaborationStore((s) => s.users);
  const localUserId = useCollaborationStore((s) => s.localUserId);

  return (
    <div className="flex items-center gap-1">
      {/* Local user */}
      <div
        className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center text-white text-xs font-bold font-display border-2 border-white shadow"
        title="You"
      >
        You
      </div>

      {/* Remote users */}
      {users.filter((u) => u.id !== localUserId).map((user) => (
        <div
          key={user.id}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold font-display border-2 border-white shadow"
          style={{ backgroundColor: user.color }}
          title={user.name}
        >
          {user.name.slice(0, 2).toUpperCase()}
        </div>
      ))}
    </div>
  );
}
