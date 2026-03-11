import React from 'react';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function UserPresence() {
  const users = useCollaborationStore((s) => s.users);
  const localUserId = useCollaborationStore((s) => s.localUserId);

  return (
    <div className="flex items-center gap-1">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
        style={{
          background: 'linear-gradient(135deg, #818CF8, #C084FC)',
          boxShadow: '0 0 0 1.5px rgba(129,140,248,0.4)',
        }}
        title="You"
      >
        You
      </div>

      {users.filter((u) => u.id !== localUserId).map((user) => (
        <div
          key={user.id}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
          style={{
            backgroundColor: user.color,
            boxShadow: `0 0 0 1.5px ${user.color}60`,
          }}
          title={user.name}
        >
          {user.name.slice(0, 2).toUpperCase()}
        </div>
      ))}
    </div>
  );
}
