import Konva from 'konva';

export function exportToPNG(stage: Konva.Stage): void {
  const uri = stage.toDataURL({ pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = `playspace-canvas-${Date.now()}.png`;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface CanvasJSON {
  version: string;
  width: number;
  height: number;
  background: string;
  layers: LayerJSON[];
  stickers: StickerJSON[];
}

export interface LayerJSON {
  id: string;
  name: string;
  visible: boolean;
  lines: LineJSON[];
}

export interface LineJSON {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface StickerJSON {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export function exportToJSON(data: CanvasJSON): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `playspace-canvas-${Date.now()}.json`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateThumbnail(stage: Konva.Stage): string {
  return stage.toDataURL({ pixelRatio: 0.3 });
}
