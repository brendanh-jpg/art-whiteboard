import React from 'react';
import { Circle, Text as KonvaText, Group } from 'react-konva';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function CursorOverlay() {
  const users = useCollaborationStore((s) => s.users);

  return (
    <>
      {users.map((user) => (
        <Group key={user.id} x={user.cursorX} y={user.cursorY}>
          <Circle radius={8} fill={user.color} opacity={0.7} />
          <Circle radius={4} fill={user.color} />
          <KonvaText
            text={user.name}
            x={12}
            y={-6}
            fontSize={12}
            fill={user.color}
            fontFamily="'Nunito', sans-serif"
          />
        </Group>
      ))}
    </>
  );
}
