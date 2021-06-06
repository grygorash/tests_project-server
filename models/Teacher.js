const { Schema, model } = require('mongoose');

const TeacherSchema = new Schema({
  email: { type: String, required: true },
});

const Teacher = model('Teacher', TeacherSchema);

module.exports = Teacher;
