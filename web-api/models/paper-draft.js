'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperDraftSchema = new Schema({
  paperName: String,
  isPublished: Boolean,
  groupId: Number,
  groupHashId: Schema.Types.ObjectId,
  makerId: Number,
  updateTime: Number,
  createTime: Number,
  logicPuzzleSections: [{
    easyCount: Number,
    normalCount: Number,
    hardCount: Number
  }],
  homeworkSections: [{
    items: [{
      definitionRepo: String,
      branch: String,
      templateRepo: String,
      descriptionAddress: String,
      inspectionAddress: String
    }]
  }]
});

module.exports = mongoose.model('PaperDraft', paperDraftSchema);
