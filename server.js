const express = require('express');

const app = express();

app.use(express.static('./dist/plants-hub'));

app.get('*', (req, res) =>
  res.sendFile('dist/plants-hub/index.html'),
);

app.listen(process.env.PORT || 8080);
