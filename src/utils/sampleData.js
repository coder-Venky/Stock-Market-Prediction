export const generateSampleData = (length = 100) => {
  return Array.from({ length }, (_, i) => 
    100 + 10 * Math.sin(i / 10) + Math.random() * 5
  );
};