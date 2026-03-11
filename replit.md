# Art Whiteboard

A collaborative digital whiteboard app built with React, Konva, Zustand, and Tailwind CSS.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Canvas**: Konva / react-konva
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7

## Project Structure

```
src/
  App.tsx                  - Main app component
  main.tsx                 - Entry point
  index.css                - Global styles
  hooks/
    useCollaboration.ts    - Collaboration hook
  stores/
    canvasStore.ts         - Canvas state (shapes, history)
    collaborationStore.ts  - Collaboration state
    toolStore.ts           - Active tool state
  utils/
    colors.ts              - Color utilities
    export.ts              - Export utilities
    particles.ts           - Particle effects
    wallpapers.ts          - Background wallpapers
```

## Development

The app runs on port 5000 via the "Start application" workflow (`npm run dev`).

## Deployment

Configured as a static site:
- Build: `npm run build`
- Public dir: `dist`
