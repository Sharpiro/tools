const yearLabels = [...Array(61).keys()]
let data = []
const principal = 100000
let inflationRate = 0
var canvas = document.getElementById("myChart")
var context = canvas.getContext('2d');

slider.value = 0
value.innerHTML = slider.value;

var myChart = new Chart(context, {
    type: 'line',
    data: {
        labels: yearLabels,
        datasets: [{
            label: 'Inflation',
            fill: false,
            data: data
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
})

updateInflation(inflationRate)


slider.oninput = function () {
    updateInflation(this.value)
    value.innerHTML = this.value;
}

function updateInflation(inflationRate) {
    inflationRate = inflationRate / 100
    data = yearLabels.map(y => principal / (1 + inflationRate) ** y)
    myChart.data.datasets[0].data = data
    myChart.update()

    fiveYears.innerHTML = `${(1 - data[5] / principal) * 100}%`
    tenYears.innerHTML = `${(1 - data[10] / principal) * 100}%`
    twentyYears.innerHTML = `${(1 - data[20] / principal) * 100}%`
    fourtyYears.innerHTML = `${(1 - data[40] / principal) * 100}%`
    sixtyYears.innerHTML = `${(1 - data[60] / principal) * 100}%`
}