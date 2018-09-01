'use strict';

// Third Party Modules
import express from 'express';
import morgan from 'morgan';
//import cors from 'cors';

// Our modules
import router from '../src/api/api';
import errorHandler from './middleware/error';
import notFound from './middleware/404';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan());
//app.use(cors);
// Our API
app.use(router);

// Our 404 Handling Middleware
app.use(notFound);

// Our Error Handling Middleware
app.use(errorHandler);
// Flag to know if we are up and going


// module.exports = {
//   start: port => app.listen(port, console.log('Listening on PORT', port)),
//   stop: () => app.close(),
//   server: app,
// };

let server;

module.exports = {
  start: (port) => {
    if(! server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log(`Server up on ${port}`);
      });
    }
    else {
      console.log('Server is already running');
    }
  },
  stop: () => {
    server.close( () => {
      console.log('Server has been stopped');
    });
  },
  server: app,
};