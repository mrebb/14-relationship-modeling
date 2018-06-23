'use strict';
import mongoose, { Schema } from 'mongoose';

// let MONGODB_URI = 'mongodb://127.0.0.1';
// mongoose.connect(MONGODB_URI);
const skillsetSchema = new Schema({
  languages: {type: String},
  role: {type:String, required: true},
});

const Skills = mongoose.model('Skills',skillsetSchema);

export default Skills;