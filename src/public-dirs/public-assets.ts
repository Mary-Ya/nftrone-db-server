import express from "express";

export const buildLayersAssetsRouter = () => {
  return express.static('uploads');
}

// TBD
export const buildResultImagesRouter = () => {
  return express.static('collections');
}
