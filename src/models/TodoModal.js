const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    id: {type: String, require: true, unique: true},
    content: {type: String, require}
  }
)

module.exports = mongoose.model("Todo", todoSchema);
