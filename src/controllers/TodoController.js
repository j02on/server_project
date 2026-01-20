/**
 * @file Todo 컨트롤러
 * @description Todo CRUD 작업을 처리하는 컨트롤러 함수들
 */

const TodoModal = require("../models/TodoModal");
const Counter = require('../services/counter');

/**
 * 새로운 Todo 생성
 * @async
 * @function createTodo
 * @param {import('express').Request} req - Express 요청 객체
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.content - Todo 내용
 * @param {import('express').Response} res - Express 응답 객체
 * @param {import('express').NextFunction} next - 다음 미들웨어 함수
 * @returns {Promise<void>}
 * @throws {Error} 데이터베이스 작업 실패 시
 */
const createTodo = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: '필수 값을 입력해주세요.' });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: 'planId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newTodo = await TodoModal.create({
      id: counter.seq,
      content: content
    });

    res.status(201).json({
      message: 'Todo가 생성되었습니다.',
      todo: newTodo
    });

  } catch(error) {
    next(error);
  }
};

/**
 * 전체 Todo 목록 조회
 * @async
 * @function viewTodo
 * @param {import('express').Request} req - Express 요청 객체
 * @param {import('express').Response} res - Express 응답 객체
 * @param {import('express').NextFunction} next - 다음 미들웨어 함수
 * @returns {Promise<void>}
 * @throws {Error} 데이터베이스 작업 실패 시
 */
const viewTodo = async (req, res, next) => {
  try {
    const todo = await TodoModal.find();

    if (!todo) {
      return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

/**
 * 특정 Todo 수정
 * @async
 * @function editTodo
 * @param {import('express').Request} req - Express 요청 객체
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - Todo ID
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.content - 수정할 Todo 내용
 * @param {import('express').Response} res - Express 응답 객체
 * @param {import('express').NextFunction} next - 다음 미들웨어 함수
 * @returns {Promise<void>}
 * @throws {Error} 데이터베이스 작업 실패 시
 */
const editTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: '필수 값을 입력해주세요.' });
    }

    const updatedTodo = await TodoModal.findOneAndUpdate(
      { id: Number(id) },
      { content },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

/**
 * 특정 Todo 삭제
 * @async
 * @function delTodo
 * @param {import('express').Request} req - Express 요청 객체
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - Todo ID
 * @param {import('express').Response} res - Express 응답 객체
 * @param {import('express').NextFunction} next - 다음 미들웨어 함수
 * @returns {Promise<void>}
 * @throws {Error} 데이터베이스 작업 실패 시
 */
const delTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTodo = await TodoModal.findOneAndDelete({
      id: Number(id),
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: 'Todo가 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};

/**
 * 전체 Todo 삭제
 * @async
 * @function delAllTodo
 * @param {import('express').Request} req - Express 요청 객체
 * @param {import('express').Response} res - Express 응답 객체
 * @param {import('express').NextFunction} next - 다음 미들웨어 함수
 * @returns {Promise<void>}
 * @throws {Error} 데이터베이스 작업 실패 시
 */
const delAllTodo = async (req, res, next) => {
  try {
    const result = await TodoModal.deleteMany({});

    res.status(200).json({ 
      message: '모든 Todo가 삭제되었습니다.',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  viewTodo,
  editTodo,
  delTodo,
  delAllTodo,
};