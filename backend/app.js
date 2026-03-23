/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { CustomError } = require('./utils/customError');
const cors = require('cors');
const fs = require('fs')
const swaggerUi = require("swagger-ui-express");
const {swaggerSpec} = require("./utils/swagger");

const indexRouter = require('./src/routes/index');
const { startOfferCleanup } = require('./utils/cron');
const { insertIntoErrorLogger } = require('./src/middleWare/errorLogger');
const { redisRateLimiter } = require('./src/middleWare/rateLimiter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/src/', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//cron jobs
startOfferCleanup();

app.use('/api', redisRateLimiter, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(async function(err, req, res, next) {
  if (err.status === 500 || !(err instanceof CustomError)) {
    await insertIntoErrorLogger(
      err.message, err.stack,
      req.originalUrl, req.ip, req.method, req.headers['user-agent'],
      req.userData,
    );
  }
  // set locals, only providing error in development
  res.locals.message = err.message;

  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ statusCode: err.statusCode, error: err.message });
  }
  // render the error page
  res.status(err.status || 500).send({
    statusCode: err.statusCode,
    error: err.name,
    keyValue: JSON.stringify(err.keyValue),
    message: err.message,
  });
});

const publicDir = "public";
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const publicUploads = "public/uploads";
if (!fs.existsSync(publicUploads)) {
  fs.mkdirSync(publicUploads);
}

const publicTemplates = "public/templates";
if (!fs.existsSync(publicTemplates)) {
  fs.mkdirSync(publicTemplates);
}

const publicReports = "public/reports";
if (!fs.existsSync(publicReports)) {
  fs.mkdirSync(publicReports);
}

module.exports = app;
