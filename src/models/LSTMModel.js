import * as tf from '@tensorflow/tfjs';

export class StockPriceModel {
  constructor(sequenceLength) {
    this.sequenceLength = sequenceLength;
    this.model = this.buildModel();
  }

  buildModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.lstm({
      units: 50,
      returnSequences: true,
      inputShape: [this.sequenceLength, 1]
    }));
    
    model.add(tf.layers.dropout(0.2));
    
    model.add(tf.layers.lstm({
      units: 50,
      returnSequences: false
    }));
    
    model.add(tf.layers.dropout(0.2));
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    return model;
  }

  async train(sequences, targets, epochs = 50, batchSize = 32) {
    const xs = tf.tensor3d(sequences, [sequences.length, this.sequenceLength, 1]);
    const ys = tf.tensor2d(targets, [targets.length, 1]);

    await this.model.fit(xs, ys, {
      epochs,
      batchSize,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
        }
      }
    });

    xs.dispose();
    ys.dispose();
  }

  predict(sequence) {
    const input = tf.tensor3d([sequence], [1, this.sequenceLength, 1]);
    const prediction = this.model.predict(input);
    const result = prediction.dataSync()[0];
    input.dispose();
    prediction.dispose();
    return result;
  }
}