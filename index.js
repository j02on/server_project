require('dotenv').config();

const express = require('express');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');

// 라우터
const todoRoutes = require('./src/routes/TodoRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

/* =========================
   보안 설정
========================= */
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman 허용
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error('🔥 에러 발생');ㅂ
  console.error('URL:', req.method, req.originalUrl);
  console.error('에러 메시지:', err.message);
  console.error('전체 에러:', err);

  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

/* =========================
   요청 제한
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* =========================
   Body 파싱
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   라우터
========================= */
app.use('/todo', todoRoutes);

/* =========================
   404 핸들러
========================= */
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

/* =========================
   MongoDB 연결 + 서버 실행
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');

    server.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
  });

module.exports = app;

