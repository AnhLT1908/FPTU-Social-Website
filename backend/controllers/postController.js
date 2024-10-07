const Post = require('../models/postModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getPostById = factoryGetOne(Post);
exports.createNewPost = factoryCreateOne(Post);
exports.getAllPosts = factoryGetAll(Post);
exports.updatePost = factoryUpdateOne(Post);
exports.deletePost = factoryDeleteOne(Post);
