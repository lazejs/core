import * as mongoose from 'mongoose'

export const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}))