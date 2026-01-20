/**
 * @file Todo 관련 라우트 정의
 * @description Todo CRUD 작업을 위한 REST API 엔드포인트
 */

const express = require('express');
const { createTodo, viewTodo, editTodo, delTodo, delAllTodo } = require('../controllers/TodoController');
const router = express.Router();

/**
 * @route POST /todo
 * @description 새로운 Todo 생성
 * @access Public
 */
router.post('/', createTodo);

/**
 * @route GET /todo
 * @description 전체 Todo 목록 조회
 * @access Public
 */
router.get('/', viewTodo);

/**
 * @route PATCH /todo/:id
 * @description 특정 Todo 수정
 * @param {number} id - Todo ID
 * @access Public
 */
router.patch('/:id', editTodo);

/**
 * @route DELETE /todo/:id
 * @description 특정 Todo 삭제
 * @param {number} id - Todo ID
 * @access Public
 */
router.delete('/:id', delTodo);

/**
 * @route DELETE /todo
 * @description 전체 Todo 삭제
 * @access Public
 */
router.delete('/', delAllTodo);

module.exports = router;