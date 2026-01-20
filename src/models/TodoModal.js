/**
 * @file Todo 모델
 * @description Todo 데이터 스키마 및 모델 정의
 */

const mongoose = require('mongoose');

/**
 * Todo 스키마 정의
 * @typedef {Object} TodoSchema
 * @property {number} id - Todo의 고유 식별자 (자동 증가)
 * @property {string} content - Todo 내용
 * @property {Date} createdAt - 생성 일시 (자동 생성)
 * @property {Date} updatedAt - 수정 일시 (자동 생성)
 */

/**
 * Todo Mongoose 스키마
 * @type {mongoose.Schema<TodoSchema>}
 */
const todoSchema = new mongoose.Schema(
  {
    /**
     * Todo ID (자동 증가)
     * @type {number}
     */
    id: {
      type: Number,
      required: true,
      unique: true
    },
    /**
     * Todo 내용
     * @type {string}
     */
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Todo 모델
 * @type {mongoose.Model<TodoSchema>}
 */
module.exports = mongoose.model("Todo", todoSchema);