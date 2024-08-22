export interface ImageAttributes {
  privateId?: number;
  id?: string;
  name: string;
  metadata?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  layerID: string;
}

export interface ImagesToPost {
  files: File[];
  projectID: string;
  layerID: string;
  width: number;
  height: number;
}


export type ImageForCreation = {
  layerID: ImageAttributes['layerID'];
  name: ImageAttributes['name'];
};

