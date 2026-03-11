import React from 'react';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function UserPresence() {
  const users = useCollaborationStore((s) => s.users);
  const localUserId = useCollaborationStore((s) => s.localUserId);
  const localUserName = useCollaborationStore((s) => s.localUserName);
  const localUserColor = useCollaborationStore((s) => s.localUserColor);
  const isConnected = useCollaborationStore((s) => s.isConnected);

  return (
    <div className="flex items-center gap-1">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
        style={{
          backgroundColor: localUserColor,
          boxShadow: `0 0 0 1.5px ${localUserColor}60`,
        }}
        title={localUserName || 'You'}
      >
        {(localUserName || 'You').slice(0, 2).toUpperCase()}
      </div>

      {isConnected && (
        <div
          className="w-2 h-2 rounded-full -ml-2.5 mb-3"
          style={{ backgroundColor: '#34D399', border: '1.5px solid white' }}
          title="Connected"
        />
      )}

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
