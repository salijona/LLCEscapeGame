//import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2.2/dist/tf.min.js";
//import * as tfvis from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.1.0";
//import * as Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.0.0/papaparse.min.js";
//import * as Plotly from "https://cdn.plot.ly/plotly-1.48.3.min.js";
//import _ from "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js";

Papa.parsePromise = function(file) {
  return new Promise(function(complete, error) {
    Papa.parse(file, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete,
      error
    });
  });
};

const prepareData = async () => {
  const csv = await Papa.parsePromise(
    "https://raw.githubusercontent.com/curiousily/Linear-Regression-with-TensorFlow-js/master/src/data/housing.csv"
  );

  return csv.data;
};

const renderScatter = (container, data, columns, config) => {

  let maxX = 6000;
  let maxY = 800000;
  var trace = {
    x: data.map(r => r[columns[0]]),
    y: data.map(r => r[columns[1]]),
    mode: "markers",
    type: "scatter",
    opacity: 0.7,
    marker: {
      color: "dodgerblue"
    }
  };

  var x = [];
  var y = [];
  for(var i = 0; i < maxX; i = i + (maxX/100)){
    x.push(i);
  }
  for(var j = 0; j < maxY; j = j + (maxY/100)){
    y.push(j);
  }

  var z = [];
  for (j = 0; j < y.length; j++) {
    var temp = [];
    for (i = 0; i < x.length; i++) {
      temp.push(0);
    }
    z.push(temp);
  }


  var traceGrid = {
    x: x,
    y: y,
    z: z,
    type: "heatmap",
    colorscale: [["0.0", "rgb(255, 255, 255, 0.5)"], ["1.0", "rgb(255, 255, 255, 0.5)"]],
    xgap: 1,
    ygap: 1,
    hoverinfo: "x",
    showscale: false
  }

  var chartData = [trace,traceGrid];

  Plotly.newPlot(container, chartData, {
    height: 450,
    title: config.title,
    xaxis: {
      title: config.xLabel,
      range: [0, maxX]
    },
    yaxis: {
      title: config.yLabel,
      range: [0, maxY]}
  });
};

const renderPredictions = (trueValues, slmPredictions, xTestSimple, xTest, bias, weight,preds_x,pred_y) => {

  var trace = {
    x: xTest.dataSync(),
    y: trueValues,
    mode: "markers",
    type: "scatter",
    name: "true",
    opacity: 0.5,
    marker: {
      color: "dodgerblue"
    }
  };

  const inputMax = xTest.max();
  const inputMin = xTest.min();

  const original_preds = preds_x.mul(inputMax.sub(inputMin))
        .add(inputMin);


  var slmTrace = {
    x: original_preds,
    y: pred_y,
    name: "linear regression",
    mode: "markers",
    type: "scatter",
    opacity: 0.5,
    marker: {
      color: "forestgreen"
    }
  };


  var regressionTrace = {
    x: xTest.dataSync(),
    y: slmPredictions,
    name: "pred",
    mode: "lines+markers",
    type: "scatter",
    opacity: 0.5,
    marker: {
      color: "forestgreen"
    }
  };

  //const m = tf.variable(tf.scalar(weight));
  //const b = tf.variable(tf.scalar(bias));

  /*let lin_vals = weight.mul(xTestSimple).add(bias)
  console.log(bias.dataSync(),lin_vals.dataSync())
  var linear_regression = {
    x: xTest.dataSync(),
    y: lin_vals.dataSync(),
    name: "regression",
    mode: 'lines'
  };*/


  Plotly.newPlot("slm-predictions-cont", [trace, slmTrace,regressionTrace], {
    title: "Simple Linear Regression predictions",
    yaxis: { title: "Price",  range: [0, 800000] },
    xaxis: {
      range: [0, 6000]
    },
  });

};

const VARIABLE_CATEGORY_COUNT = {
  OverallQual: 10,
  GarageCars: 5,
  FullBath: 4
};

// normalized = (value − min_value) / (max_value − min_value)
const normalize = tensor =>
  tf.div(
    tf.sub(tensor, tf.min(tensor)),
    tf.sub(tf.max(tensor), tf.min(tensor))
  );

const oneHot = (val, categoryCount) =>
  Array.from(tf.oneHot(val, categoryCount).dataSync());

const createDataSets = (data, features, categoricalFeatures, testSize) => {
  console.log(data.length)
  const X = data.map(r =>
    features.flatMap(f => {
      if (categoricalFeatures.has(f)) {
        return oneHot(!r[f] ? 0 : r[f], VARIABLE_CATEGORY_COUNT[f]);
      }
      return !r[f] ? 0 : r[f];
    })
  );

  const X_t = normalize(tf.tensor2d(X));

  const y = tf.tensor(data.map(r => (!r.SalePrice ? 0 : r.SalePrice)));

  const splitIdx = parseInt(data.length - testSize, 10);

  const [xTrain, xTest] = tf.split(X_t, [splitIdx, data.length - splitIdx]);
  const [yTrain, yTest] = tf.split(y, [splitIdx, data.length - splitIdx]);
  const [XTrain, XTest] = tf.split(X, [splitIdx, data.length - splitIdx]);

  return [xTrain, xTest, yTrain, yTest,XTrain, XTest];
};

const trainLinearModel = async (xTrain, yTrain) => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [xTrain.shape[1]],
      units: xTrain.shape[1],
      //activation: "sigmoid"
    })
  );
  //model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.sgd(0.001),
    loss: "meanSquaredError",
    metrics: [tf.metrics.meanAbsoluteError]
  });

  const trainLogs = [];
  const lossContainer = document.getElementById("loss-cont");

  await model.fit(xTrain, yTrain, {
    batchSize: 32,
    epochs: 50,
    shuffle: true,
    validationSplit: 0.1,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        trainLogs.push({
          "error": Math.sqrt(logs.loss),
          "val_error": Math.sqrt(logs.val_loss),
          mae: logs.meanAbsoluteError,
          val_mae: logs.val_meanAbsoluteError
        });
        tfvis.show.history(lossContainer, trainLogs, ["error", "val_error"]);

      }
    }
  });

  return [model, trainLogs[trainLogs.length-1].error, trainLogs[trainLogs.length-1].val_error];
};

const run = async () => {
  const data = await prepareData();
  const testSize = 0.1;
  const splitIdx = parseInt((1 - testSize) * data.length, 10);
  let test_data = data.slice(0,data.length - splitIdx)
  let train_data = data.slice(data.length - splitIdx,data.length)
  renderScatter("livarea-price-cont", train_data, ["GrLivArea", "SalePrice"], {
    title: "Living Area vs Price",
    xLabel: "Living Area",
    yLabel: "Price"
  });

  function clic(data){
    console.log(data)

    const rbs = document.querySelectorAll('input[name="edit_mode"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }

    const remainingEditsCounter = document.getElementById("edit_mode_counter");
    remainingEditsCounter.value = parseInt(remainingEditsCounter.value)+1

    var pts = '';
    for(var i=0; i < data.points.length; i++){
        pts = 'x = '+data.points[i].x +'\ny = '+
            data.points[i].y.toPrecision(4) + '\n\n';
    }
    //alert('Closest point clicked:\n\n'+pts);
    //let originalTarget = data.event.originalTarget;
    //console.log(originalTarget.getContext('2d'));

    if (selectedValue=="delete"){
      const pointIndex = data.points[0].pointIndex
      train_data.splice(pointIndex,1)
    }

    else if (selectedValue=="add"){
      train_data.splice(0,0,{"GrLivArea":data.points[1].x, "SalePrice":data.points[1].y})

      //console.log(data,train_data)
    }


    renderScatter("livarea-price-cont", train_data, ["GrLivArea", "SalePrice"], {
    title: "Living Area vs Price",
    xLabel: "Living Area",
    yLabel: "Price"});
    document.getElementById('livarea-price-cont').on('plotly_click', clic);
  }

  document.getElementById('livarea-price-cont').on('plotly_click', clic);

  const train_clic = async (event) => {
    event.preventDefault()
    const [
      xTrainSimple,
      xTestSimple,
      yTrainSimple,
      yTest,
      XTrain, XTest
    ] = createDataSets(train_data.concat(test_data), ["GrLivArea"], new Set(), testSize* data.length);
    const trainedModel = await trainLinearModel(xTrainSimple, yTrainSimple);
    const simpleLinearModel = trainedModel[0];
    const trainedError = trainedModel[1].toFixed(2);
    const validationError = trainedModel[2].toFixed(2);
    const trueValues = yTest.dataSync();
    const slmPreds = simpleLinearModel.predict(xTestSimple).dataSync();
    const xs = tf.linspace(0, 1, 100);
    const preds = simpleLinearModel.predict(xs.reshape([100, 1]));

    let  weight = simpleLinearModel.getWeights()[0]
    let  bias = simpleLinearModel.getWeights()[1]

    document.querySelector('#regression_formula').innerHTML = "y = "+Number(weight.dataSync()).toFixed(2)+"*x+"+Number(bias.dataSync()).toFixed(2)+"<br/> Train Error: "+trainedError+" Test Error: "+validationError
    renderPredictions(trueValues, slmPreds, xTestSimple, XTest,bias, weight,preds);
  }


  //document.getElementById('btn-train').on('clic', train_clic);

  const btn = document.querySelector('#btn-train');
  // handle button click
  btn.onclick = train_clic

};

if (document.readyState !== "loading") {
  run();
} else {
  document.addEventListener("DOMContentLoaded", run);
}






