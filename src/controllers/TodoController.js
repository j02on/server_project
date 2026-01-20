const TodoModal = require("../models/TodoModal");
const Counter = require('../services/counter');

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

    await TodoModal.create({
      id: counter.seq,
      content: content
    });

  } catch(error) {
    next(error)
  }
};

const viewTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await TodoModal.findOne({ id: Number(id) });

    if (!todo) {
      return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};


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


module.exports = {
  createTodo,
  viewTodo,
  editTodo,
  delTodo,
};
