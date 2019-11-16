import express from 'express';
// Express related imports
// other node package imports
...
import models, { connectDb } from './models';
const app = express();
// additional Express stuff: middleware, routes, ...
...
connectDb().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});
