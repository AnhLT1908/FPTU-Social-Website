const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 🔴 Shutting Down...');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
