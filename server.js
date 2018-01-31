const express = require("express");
const app = express()
const { spotifyMetrics } = require('./spotifyMetrics.js');
const path = require("path");

app.get('/api/metrics', (req, res) => {
  spotifyMetrics().then(perfMetrics => res.send(perfMetrics))
                  .catch(err => res.send(err));
});

app.use(express.static(path.resolve(__dirname, "./react-ui/build")));

app.get("/", function(request, response) {
  response.sendFile(path.resolve(__dirname, "./react-ui/build", "index.html"));
});

app.listen(5000, () => console.log('Up and runnin\' on port 5000! ♪♩♫♯♭'))
