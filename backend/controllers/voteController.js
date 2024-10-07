const Vote = require('../models/voteModel');
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
exports.updateVote = factoryUpdateOne(Vote);
exports.deleteVote = factoryDeleteOne(Vote);
