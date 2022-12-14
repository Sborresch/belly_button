function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var allsamples = data.samples 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredsamples = allsamples.filter(element => element.id === sample);
    
    // 1(3). Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMeta = data.metadata.filter(element => element.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstPerson = filteredsamples[0]

    // 2(3). Create a variable that holds the first sample in the metadata array.
    var firstMeta = filteredMeta[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_value = firstPerson.otu_ids
    var otu_labels_value = firstPerson.otu_labels
    var sample_value = firstPerson.sample_values

    Object.entries(firstPerson).forEach(([key, value]) =>
        {console.log(key + ': ' + value);});

    // 3(3). Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(firstMeta.wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids_value.slice(0,9).map(element => `OTU ${element}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_value.slice(0,9).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels_value.slice(0,9).reverse()
      }];
    
     // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
      };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1(2). Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids_value,
      y: sample_value,
      text: otu_labels_value,
      mode: "markers",
      marker: {
        size: sample_value, 
        color: otu_ids_value, 
        colorscale: "agsunsets"
      }
    }];
    
    // 2(2). Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      height: 600,
      width: 1200,
      hovermode: "closest"
      };
    
    // 3(2). Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4(3). Create the trace for the gauge chart.
        var gaugeData = [{
          value: washingFreq,
          title: {text: "Scrubs per Week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {range: [null, 10], tickwidth: 1, tickcolor: "black"},
            bgcolor: "white",
            bar: {color: "black"},
            steps: [
              {range: [0,2], color: "red"},
              {range: [2,4], color: "orange"},
              {range: [4,6], color:"yellow"},
              {range: [6,8], color: "yellowgreen"},
              {range: [8,10], color: "forestgreen"}
            ]}
        }];
        
    // 5(3). Create the layout for the gauge chart.
        var gaugeLayout = { 
         title: {text: "Belly Button Washing Frequency", font: "bold"},
         height: 400,
         width: 400,
         margin: {t:100,b:100}
        };
    
    // 6(3). Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
})}
