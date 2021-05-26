const express = require('express');
const { port } = require('./config/vars');
const controller = require('./controller');

const app = express();

app.use('/api', controller);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
