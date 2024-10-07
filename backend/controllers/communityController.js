const Community = require('../models/communityModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getCommunityById = factoryGetOne(Community);
exports.createNewCommunity = factoryCreateOne(Community);
exports.getAllCommunities = factoryGetAll(Community);
exports.updateCommunity = factoryUpdateOne(Community);
exports.deleteCommunity = factoryDeleteOne(Community);
