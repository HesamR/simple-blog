export function isDev(): boolean {
  const mode = process.env.Node_ENV;
  return mode !== 'production';
}
