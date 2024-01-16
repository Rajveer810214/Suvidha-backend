const mongoose = require('mongoose');
const UserInfo = require('./User');

const internSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserInfo,
  },
  name: { type: String, required: true },
  domain: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, default: 'pending' },
});

const InternModel = mongoose.model('Intern', internSchema);

module.exports = InternModel;
