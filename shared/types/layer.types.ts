import { ImageAttributes } from "./image.types";

export interface LayerAttributes {
  privateId?: number;
  id?: string;
  name: string;
  x?: number;
  y?: number;
  canvas_width?: number;
  canvas_height?: number;
  order?: number; // layers order number in the project
  projectID: string;
  images?: ImageAttributes[];
}

export type LayerForCreation = Omit<LayerAttributes, "id" | "images">;
