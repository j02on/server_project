require('dotenv').config();

const express = require('express');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const mongoose = require('mongoose');

const todoRoutes = require('./src/routes/TodoRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

/**
 * Helmet 미들웨어를 통한 기본 보안 헤더 설정
 */
app.use(helmet());

/**
 * CORS 허용 오리진 목록
 * @type {string[]}
 */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
];

/**
 * CORS 설정
 * - 허용된 오리진에서만 요청 가능
 * - Postman과 같은 도구는 origin이 없으므로 허용
 * - credentials 옵션 활성화
 */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

/**
 * Rate Limiter 설정
 * - 15분당 최대 100개의 요청 허용
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/**
 * Body 파싱 미들웨어
 * - JSON 형식의 요청 본문 파싱
 * - URL-encoded 형식의 요청 본문 파싱
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 라우터 등록
 * - /todo 경로에 대한 모든 요청을 todoRoutes로 처리
 */
app.use('/todo', todoRoutes);

/**
 * 404 에러 핸들러
 * - 정의되지 않은 라우트에 대한 요청 처리
 * @param {express.Request} req - Express 요청 객체
 * @param {express.Response} res - Express 응답 객체
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

/**
 * 전역 에러 핸들러
 * - 애플리케이션 전체에서 발생하는 에러 처리
 * @param {Error} err - 발생한 에러 객체
 * @param {express.Request} req - Express 요청 객체
 * @param {express.Response} res - Express 응답 객체
 * @param {express.NextFunction} next - 다음 미들웨어 함수
 */
app.use((err, req, res, next) => {
  console.error('🔥 에러 발생');
  console.error('URL:', req.method, req.originalUrl);
  console.error('에러 메시지:', err.message);
  console.error('전체 에러:', err);

  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

/**
 * MongoDB 연결 및 서버 시작
 * - MongoDB 연결 성공 시 Express 서버 시작
 * - 연결 실패 시 에러 로그 출력
 */
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