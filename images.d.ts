declare module '*.png' {
  const content: number; // For React Native, images are numbers (resource IDs)
  export default content;
}
