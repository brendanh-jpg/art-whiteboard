# PlaySpace - Collaborative Digital Whiteboard

A collaborative digital whiteboard app built with React, Konva, Zustand, and Tailwind CSS.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Canvas**: Konva / react-konva
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7
- **Multiplayer**: WebSocket (ws package)

## Project Structure

```
src/
  App.tsx                  - Main app component
  main.tsx                 - Entry point
  index.css                - Global styles
  hooks/
    useCollaboration.ts    - Real-time WebSocket collaboration hook
  stores/
    canvasStore.ts         - Canvas state (lines, stickers, layers, history, gallery, localStorage persistence)
    collaborationStore.ts  - Collaboration state (users, room, name/color, connection)
    toolStore.ts           - Active tool state
  utils/
    colors.ts              - Color utilities
    multiplayer.ts         - Multiplayer broadcast utility (singleton WS ref)
    particles.ts           - Particle effects
    wallpapers.ts          - Background wallpapers
  components/
    Canvas/                - Canvas, DrawingLayer, StickerLayer, CursorOverlay
    Collaboration/         - UserPresence, ReactionOverlay, PassTheCanvas, NameEntryModal, SaveModal
    Gallery/               - GalleryView (persistent saves with load/delete)
    Toolbar/               - Left sidebar tool panel
    RightPanel/            - Stickers (17 categories), layers, wallpaper panel
    Stickers/              - StickerCategory, StickerItem
    Layers/                - LayerItem
server/
  index.js                 - WebSocket multiplayer server (room-based relay, port 8080)
```

## Workflows

- **Start application**: `npm run dev` — Vite dev server on port 5000
- **Multiplayer Server**: `node server/index.js` — WebSocket server on port 8080

## Features

- Drawing tools: pencil, eraser, highlighter, line, spray paint, glitter pen, rainbow brush, wallpaper brush, text, shape stamp
- 17 sticker categories with 10-12 items each
- Layer management (up to 5 layers)
- Undo/redo history (50 levels)
- Background presets and wallpaper patterns
- **localStorage auto-save**: Canvas state persists across page reloads (debounced 500ms)
- **Named gallery saves**: Save snapshots to gallery with names, load them back, delete them
- **Real-time multiplayer**: WebSocket-based room sharing via `?room=roomId` URL param
- **User presence**: Name entry on first visit, colored cursors/avatars for connected users
- **Share button**: Generates room URL and copies to clipboard
- Export as PNG

## Deployment

Configured as a static site:
- Build: `npm run build`
- Public dir: `dist`
- Note: Multiplayer requires the WebSocket server running separately
