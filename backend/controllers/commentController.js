const Comment = require('../models/commentModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getCommentById = async (req, res, next) => {
  try {
    const doc = await Comment.findById(req.params.id)
      .populate('userId')
      .populate('postId')
      .populate('parentId')
      .populate('childrens');
    if (!doc) {
      return next(
        new AppError(`No document found with ID ${req.params.id}`, 404)
      );
    }
    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};
exports.createNewComment = async (req, res, next) => {
  try {
    const doc = await Comment.create(req.body);

    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
};
exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({})
      .populate('userId')
      .populate('postId')
      .populate('parentId')
      .populate('childrens');
    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        comments: comments.map((comment) => ({
          user: comment.userId,
          post: comment.postId,
          parent: comment.parentId,
          content: comment.content,
          isEdited: comment.isEdited,
          childrens: comment.childrens,
          upVotes: comment.upVotes,
          downVotes: comment.downVotes,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.updateComment = async (req, res, next) => {
  const doc = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(
      new AppError(`No document found with ID ${req.params.id}`, 404)
    );
  }
  res.status(200).json(doc);
};
exports.deleteComment = factoryDeleteOne(Comment);
exports.createChildrenComments = async (req, res, next) => {
  try {
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const newComment = new Comment(req.body);
    const newdoc = await newComment.save(); // Use await here
    parentComment.childrens.push(newdoc._id);
    await parentComment.save().then((result) => {
      res.status(201).json(result);
    });
  } catch (error) {
    next(error);
  }
};
exports.getCommentByPostId = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ postId: postId })
      .populate('userId')
      .populate('postId')
      .populate('parentId')
      .populate('childrens');
    if (comments.lenght > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: 'Post Id invalid' });
    }
  } catch (error) {
    next(error);
  }
};
