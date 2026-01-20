const express = require('express');
const { createTodo, viewTodo, editTodo, delTodo } = require('../controllers/TodoController');
const router = express.Router();

router.post('/', createTodo);
router.get('/:id', viewTodo);
router.patch('/:id', editTodo);
router.delete('/:id', delTodo);

module.exports = router;