const Comment = require('../models/commentModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getCommentById = factoryGetOne(Comment);
exports.createNewComment = factoryCreateOne(Comment);
exports.getAllComments = factoryGetAll(Comment);
exports.updateComment = factoryUpdateOne(Comment);
exports.deleteComment = factoryDeleteOne(Comment);
