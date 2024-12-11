// Data preprocessing utilities
export const normalizeData = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return {
    normalizedData: data.map(x => (x - min) / (max - min)),
    min,
    max
  };
};

export const denormalizeData = (normalizedData, min, max) => {
  return normalizedData.map(x => x * (max - min) + min);
};

export const createSequences = (data, sequenceLength) => {
  const sequences = [];
  const targets = [];

  for (let i = 0; i < data.length - sequenceLength; i++) {
    sequences.push(data.slice(i, i + sequenceLength));
    targets.push(data[i + sequenceLength]);
  }

  return { sequences, targets };
};