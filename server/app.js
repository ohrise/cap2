var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var pool = require('./pgConnect.js'); // PostgreSQL 연결


var app = express();

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var loginRouter = require('./routers/LoginRouters.js'); // 상대 경로
var signupRouter = require('./routers/SignupRouters.js'); // 상대 경로
var FireinformationRouter = require('./routers/FireInformationRouters.js'); // 상대 경로
var PredicResultRouter = require('./routers/PredicResultRouters.js'); // 상대 경로
var ReportRouter = require('./routers/ReportRouters.js'); // 상대 경로
var ModifyRouter = require('./routers/ModifyRouters.js')


// 정적 파일 제공 경로를 수정
app.use(express.static(path.join(__dirname, "../build")));

// 모든 요청을 React의 index.html로 리다이렉트
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});


// API 라우터 설정
app.use('/api', loginRouter);
app.use('/api', signupRouter);
app.use('/api', FireinformationRouter);
app.use('/api', PredicResultRouter);
app.use('/api', ReportRouter);
app.use('/api', ModifyRouter);

// server.js
app.use((req, res, next) => {
  if (req.url.includes('%08')) {
    console.error('Invalid URL detected:', req.url);
    return res.status(400).send('Invalid request URL.');
  }
  next();
});

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}, Method: ${req.method}`);
  next();
});


app.listen(5000, () => console.log("Server is running on port 5000"));
