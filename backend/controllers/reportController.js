const Report = require('../models/reportModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getReportById = factoryGetOne(Report);
exports.createNewReport = factoryCreateOne(Report);
exports.getAllReports = factoryGetAll(Report);
exports.updateReport = factoryUpdateOne(Report);
exports.deleteReport = factoryDeleteOne(Report);
