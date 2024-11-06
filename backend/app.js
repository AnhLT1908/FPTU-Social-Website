const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorController = require('./controllers/errorController');
// const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const app = express();
const userRouter = require('./routes/userRoutes');
const communityRouter = require('./routes/communityRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const reportRouter = require('./routes/reportRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const path = require('path');
// 1) MIDDLEWARES
// app.set('trust proxy', 3);
// Access-Control-Allow-Origin *

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:9999',
      'http://localhost:3000',
      'http://127.0.0.1:9999',
      'http://127.0.0.1:3000',
    ],
  })
);


const frontendPath = path.dirname("")

app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// 2) ROUTES
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/images', express.static(path.join(__dirname, '../frontend/src/images')));
// Các route API được server xử lý nhé
app.use('/api/v1/users', userRouter);
app.use('/api/v1/communities', communityRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/notifications', notificationRouter);

// 3) ERROR HANDLING
// Bắt lỗi các route API không hợp lệ
app.all('/api/v1/*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

// Chuyển tất cả các route không phải API tới frontend
app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
})
app.use(errorController);
module.exports = app;
