import React, { Component } from "react";

import PageMetrics from "./pageMetrics";

class App extends Component {
  render() {
    return (
      <div>
        <h1>Stats on Spotify.com</h1>
        <PageMetrics />
      </div>
    );
  }
}

export default App;
