import React, { Component } from "react";
import { setInterval } from "timers";
import { Bar, Line, defaults } from "react-chartjs-2";
import moment from "moment";

defaults.global.animation.duration = 200;

class PageMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desktopData: [],
      mobileData: [],
      timestamps: []
    };
  }

  componentDidMount() {
    setInterval(() => {
      fetch("/api/metrics/desktop")
        .then(response => response.json())
        .then(newData => {
          this.setState({
            desktopData: [...this.state.desktopData, newData].slice(-40),
            timestamps: [
              ...this.state.timestamps,
              moment().format("h:mm:ss a")
            ].slice(-40)
          });
        });
    }, 5000);

      setInterval(() => {
        fetch("/api/metrics/mobile")
          .then(response => response.json())
          .then(newData => {
            this.setState({
              mobileData: [...this.state.mobileData, newData].slice(-40)
            });
          });
      }, 5000);
  }

  getNetworkPerf() {
    console.log(this.state.desktopData);
    return {
      labels: this.state.timestamps,
      datasets: [
        {
          label: "Mobile network performance",
          fill: false,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          lineTension: 0.1,
          borderWidth: 1,
          pointBorderWidth: 1,
          borderJoinStyle: "miter",
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [...this.state.mobileData.map(data => data.networkPerformance)]
        },
        {
          label: "Desktop network performance",
          fill: true,
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
          data: [...this.state.desktopData.map(data => data.networkPerformance)]
        }
      ]
    };
  }

  getBrowserRenderData() {
    return {
      labels: ["Browser Render Data"],
      datasets: [
        {
          label: "Task Duration",
          backgroundColor: "rgba(247,70,74,0.2)",
          borderColor: "rgba(247,70,74,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(247,70,74,1)",
          hoverBorderColor: "rgba(247,70,74,0.8)",
          data: [this.state.desktopData.length ? this.state.desktopData[0].TaskDuration : 0]
        },
        {
          label: "Script Duration",
          backgroundColor: "rgba(151,187,205,0.2)",
          borderColor: "rgba(151,187,205,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(151,187,205,1)",
          hoverBorderColor: "rgba(151,187,205,0.8)",
          data: [this.state.desktopData.length ? this.state.desktopData[0].ScriptDuration : 0]
        },
        {
          label: "Layout Duration",
          backgroundColor: "rgba(70,191,189,0.2)",
          borderColor: "rgba(70,191,189,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(70,191,189,1)",
          hoverBorderColor: "rgba(70,191,189,0.8)",
          data: [this.state.desktopData.length ? this.state.desktopData[0].LayoutDuration : 0]
        },
        {
          label: "RecalcStyle Duration",
          backgroundColor: "rgba(77,83,96,0.2)",
          borderColor: "rgba(77,83,96,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(77,83,96,1)",
          hoverBorderColor: "rgba(77,83,96,1)",
          data: [this.state.desktopData.length ? this.state.desktopData[0].RecalcStyleDuration : 0]
        }
      ]
    };
  }

  getStackedBarOptions() {
    return {
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      }
    };
  }

  // SLOPPY AND NOT DRY :: TODO: Refactor in subcomponents. Extract logic into functions.
  render() {
    return (
      <div>
        <p>
          Mobile average:{" "}
          <strong>
            {this.state.mobileData.length
              ? Math.floor(
                  this.state.mobileData.reduce(
                    (prev, curr) => prev + curr.networkPerformance,
                    0
                  ) / this.state.mobileData.length
                )
              : 0}
          </strong>ms
        </p>
        <p>
          Desktop average:{" "}
          <strong>
            {this.state.desktopData.length
              ? Math.floor(
                  this.state.desktopData.reduce(
                    (prev, curr) => prev + curr.networkPerformance,
                    0
                  ) / this.state.desktopData.length
                )
              : 0}
          </strong>ms
        </p>
        <Line data={() => this.getNetworkPerf()} />
        <br />
        <Bar
          data={() => this.getBrowserRenderData()}
          options={this.getStackedBarOptions()}
        />
      </div>
    );
  }
}

export default PageMetrics;
