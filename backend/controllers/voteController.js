const Vote = require('../models/voteModel');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getVoteById = factoryGetOne(Vote);
exports.createNewVote = factoryCreateOne(Vote);
exports.getAllVotes = factoryGetAll(Vote);
exports.updateVote = async (req, res, next) => {
  try {
    const model = req.body.entityType;

    let newDoc;
    if (model === 'Comment') {
      newDoc = await Comment.findById(req.params.id);
    } else if (model === 'Post') {
      newDoc = await Post.findById(req.params.id);
    }

    if (newDoc) {
      // Kiểm tra xem newDoc có tồn tại không
      if (req.body.isUpVote) newDoc.upVotes += 1;
      else newDoc.downVotes += 1;
      await newDoc.save().then((result) => {
        res.status(200).json({ result: result });
      });
    } else {
      res.status(404).json({ message: 'Document not found' }); // Trả về lỗi nếu không tìm thấy tài liệu
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteVote = factoryDeleteOne(Vote);
// exports.getVoteByEntityId = async (req, res, next) => {
//   const id = req.params.id;
//   const votes = Vote.find({ voteEntityId: id });
// };
