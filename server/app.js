var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var pool = require('./pgConnect.js');


var app = express();

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));


app.use(cookieParser());

var loginRouter = require('./routers/LoginRouters.js');
var signupRouter = require('./routers/SignupRouters.js'); 
var FireinformationRouter = require('./routers/FireInformationRouters.js'); 
var PredicResultRouter = require('./routers/PredicResultRouters.js'); 
var ReportRouter = require('./routers/ReportRouters.js'); 
var ModifyRouter = require('./routers/ModifyRouters.js')


// // React 빌드 파일 제공 코드 주석 처리 (빌드 안 했으므로 필요 없음)
// app.use(express.static(path.join(__dirname, 'finalcap2', 'build')));

// // React의 모든 경로를 index.html로 연결 코드 주석 처리
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'finalcap2', 'build', 'index.html'));
// });

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