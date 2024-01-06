export const config = {
  port: parseInt(process.env.port) || 3000,
  is_dev: process.env.NODE_ENV
};