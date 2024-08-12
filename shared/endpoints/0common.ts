export const PORT = 5474;
export const API_ADDRESS = `http://localhost:${PORT}`;

export const buildApiPath = (path: string, params: Record<string, string>) => {
  return Object.keys(params).reduce((accPath, key) => {
    return accPath.replace(`:${key}`, params[key]);
  }, path);
};
