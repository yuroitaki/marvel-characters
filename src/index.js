const express = require('express');
const { port } = require('./config/vars');
const controller = require('./controller');
const { errorMiddleware } = require('./middleware/error/error.middleware');

const app = express();

app.use('/api', controller);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
