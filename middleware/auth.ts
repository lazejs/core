import * as express from 'express'
import * as mongoose from 'mongoose';

import * as jwt from 'jsonwebtoken'
import * as assert from 'http-assert'

import * as _ from 'lodash'

export interface AuthOptions {
  model?: string | mongoose.Model<any>,
  force?: boolean,
  secret?: string,
  idKey?: string,
}

declare global {
  namespace Express {
    interface Request {
      user?: mongoose.Model<any>
    }
  }
}

const defaultOptions = {
  model: 'User',
  idKey: 'id'
}

export const Auth = (options: AuthOptions = {}): express.RequestParamHandler => {

  options = _.merge({}, options, defaultOptions)

  return async (req, res, next) => {
    const token = req.headers.authorization.split(' ').pop()
    if (!token) {
      options.force && assert(false, 400, 'JWT token is required.')
      return
    }
    let data: any
    try {
      data = jwt.verify(token, options.secret || req.app.get('secret'))
    } catch (e) {
      assert(false, e.name, e.message)
    }
    const UserModel = typeof options.model === 'string' ? mongoose.model(options.model) : options.model
    const user = await UserModel.findById(data.id)
    if (!user) {
      options.force && assert(false, 400, 'Invalid user.')
    }
    req.user = user
    await next()
  }
}