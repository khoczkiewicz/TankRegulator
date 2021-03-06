// Remarks https://nagix.github.io/chartjs-plugin-streaming/samples/line-horizontal.html

Qd = 30 // Inflow
Qo = 7 // Outflow
h = 20 // Level
output = 0 // Output to compute

var pid = new PID(2, 10, 0.01)
pid.setSampleTime(100)
pid.setOutputLimits(0, 60)
pid.setTarget(20)

var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

function scalingFactor() {
    output = pid.compute(h)
    h += Qd * (output / 100) - Qo
    return h;
}

function onRefresh(chart) {
    chart.config.data.datasets.forEach(function(dataset) {
        dataset.data.push({
            x: Date.now(),
            y: scalingFactor()
        });
    });
}

var color = Chart.helpers.color;
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'PID',
            backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: chartColors.blue,
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Water Tank Regulator'
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    refresh: 1000,
                    delay: 2000,
                    onRefresh: onRefresh,
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Water level'
                }
            }]
        },
        tooltips: {
            mode: 'nearest',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: false
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    window.myChart = new Chart(ctx, config);

    var form = document.getElementById("paramForm");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

    document.getElementById('update').addEventListener('click', function() {
        window.myChart.config.data.datasets.forEach(function(dataset) {
            dataset.data = [];
        });
        Qd = document.getElementById('qdarg').value // Inflow
        Qo = document.getElementById('qoarg').value // Outflow
        output = 0 // Output to compute
        pid = new PID(document.getElementById('parg').value, document.getElementById('iarg').value, document.getElementById('darg').value)
        pid.setSampleTime(document.getElementById('starg').value)
        pid.setOutputLimits(0, 60)
        pid.setTarget(document.getElementById('harg').value)
        window.myChart.update();
    });
};

/*document.getElementById('randomizeData').addEventListener('click', function() {
    config.data.datasets.forEach(function(dataset) {
        dataset.data.forEach(function(dataObj) {
            dataObj.y = scalingFactor();
        });
    });
    window.myChart.update();
});*/

//var colorNames = Object.keys(chartColors);

/*document.getElementById('removeDataset').addEventListener('click', function() {
    config.data.datasets.pop();
    window.myChart.update();
});*/

/*document.getElementById('addData').addEventListener('click', function() {
    onRefresh(window.myChart);
    window.myChart.update();
});*/