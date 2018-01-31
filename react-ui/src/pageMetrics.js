import React, { Component } from "react";
import { setInterval } from "timers";
import { Line } from "react-chartjs-2";
import moment from "moment"

class PageMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      timestamps: []
    };
  }

// SET UP AN ALTERNATIVE DATA SET WITH iPHONE DATA
  componentDidMount() {
    setInterval(() => {
      fetch("/api/metrics")
        .then(response => response.json())
        .then(newData => {
          this.setState({
            data: [...this.state.data, newData].slice(-40),
            timestamps: [...this.state.timestamps, moment().format('h:mm:ss a')].slice(-40)
          });
        });
    }, 5000);
  }

  getLatest() {
    console.log(this.state.data);
    return {
      labels: this.state.timestamps,
      datasets: [
        {
          label: "Network performance",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [...this.state.data.map(data => data.networkPerformance)]
        }
      ]
    };
  }

  // RENDER THE AVERAGE

  // SHOW STACKED BAR CHART OF RENDER PERFORMANCE
  render() {
    return (
      <div>
        <Line data={() => this.getLatest()} />
      </div>
    );
  }
}

export default PageMetrics;
