const mongoose = require('mongoose');
const goalSchema = mongoose.Schema({ //here we create a mongoose schema
  title: String,
  description: String,
  isComplete: Boolean,
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }
});

const Goal = mongoose.model('Goal', goalSchema); //here we create a class based on mongoose schema

const Joi = require('joi'); //validation package

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  isComplete: Joi.boolean().required(),
  listId: Joi.string().required()
}); //here we describe the schema of Joi

module.exports.Goal = Goal;
module.exports.schema = schema;
