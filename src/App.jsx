import React, { useState, useEffect } from 'react';
import { StockPriceModel } from './models/LSTMModel';
import { normalizeData, denormalizeData, createSequences } from './utils/dataPreprocessing';
import { StockChart } from './components/StockChart';
import { generateSampleData } from './utils/sampleData';

export default function App() {
  const [actualPrices, setActualPrices] = useState([]);
  const [predictedPrices, setPredictedPrices] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const sequenceLength = 10;

  useEffect(() => {
    setActualPrices(generateSampleData());
  }, []);

  const handleTrain = async () => {
    setIsTraining(true);
    try {
      // Normalize the data
      const { normalizedData, min, max } = normalizeData(actualPrices);
      
      // Create sequences for training
      const { sequences, targets } = createSequences(normalizedData, sequenceLength);
      
      // Initialize and train the model
      const model = new StockPriceModel(sequenceLength);
      await model.train(sequences, targets);
      
      // Make predictions
      const predictions = [];
      for (let i = 0; i < sequences.length; i++) {
        const prediction = model.predict(sequences[i]);
        predictions.push(prediction);
      }
      
      // Denormalize predictions
      const denormalizedPredictions = denormalizeData(predictions, min, max);
      
      // Add null values for the first sequenceLength points
      const paddedPredictions = Array(sequenceLength).fill(null).concat(denormalizedPredictions);
      setPredictedPrices(paddedPredictions);
    } catch (error) {
      console.error('Training failed:', error);
    }
    setIsTraining(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Stock Price Prediction with LSTM
        </h1>
        
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleTrain}
            disabled={isTraining}
            className={`px-6 py-2 rounded-lg text-white font-semibold
              ${isTraining 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isTraining ? 'Training...' : 'Train Model'}
          </button>

          {actualPrices.length > 0 && (
            <StockChart 
              actualData={actualPrices}
              predictedData={predictedPrices}
            />
          )}
        </div>
      </div>
    </div>
  );
}