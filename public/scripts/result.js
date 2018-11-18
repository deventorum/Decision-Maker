window.onload=function(){
var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: 'Rating',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(242, 116, 107, 0.75)',
                  'rgba(17, 140, 139, 0.75)',
                  'rgba(242, 116, 107, 0.75)',
                  'rgba(17, 140, 139, 0.75)',
                  'rgba(242, 116, 107, 0.75)',
                  'rgba(17, 140, 139, 0.75)'
              ],
              borderColor: [
                  '#f2746b',
                  '#118c8b',
                  '#f2746b',
                  '#118c8b',
                  '#f2746b',
                  '#118c8b'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}