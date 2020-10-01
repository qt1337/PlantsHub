const express = require('express');

const app = express();

app.use(express.static('./dist/PlantsHub'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/PlantsHub/'}),
);

app.listen(process.env.PORT || 8080);
