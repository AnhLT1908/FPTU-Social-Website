const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 🔴 Shutting Down...');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');
const { initSocket } = require('./socket');
const DB = process.env.LOCAL_DATABASE;
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 9999;
const host = process.env.HOST || 'localhost';
const server = http.createServer(app);
initSocket(server);
server.listen(port, () => {
  console.log(`App running on http://${host}:${port}`);
});
