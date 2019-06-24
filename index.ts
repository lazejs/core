import * as express from 'express'
import Debug from 'debug'
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as _ from 'lodash'
import * as requireAll from 'require-all'
import { Laze } from './laze';

const debug = Debug('lazejs:core')

export class App {

  public app: express.Application

  constructor(options: Laze.AppOptions = {}) {
    const defaultOptions: Laze.AppOptions = {
      cors: {
        origin: '*'
      },
      db: {
        url: 'mongodb://localhost/lazejs',
        options: {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
        },
      },
    }

    options = _.merge({}, defaultOptions, options)

    // debug('init with options: %O', options)

    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(cors(options.cors))
    this.initDatabase(options.db)

    this.app = app
  }

  start(port) {
    this.app.listen(port, (err) => {
      debug(`Server is listening at: http://localhost:${port}`)
    })
  }

  route(prefix: string, callback: (router: express.Router) => void) {
    const router: express.Router = express.Router({
      mergeParams: true
    })
    callback.call(this, router)
    this.app.use(prefix, router)
  }
  
  use(...middelware) {
    return this.app.use(...middelware)
  }

  initDatabase(options: Laze.DBOptions, callback?) {
    mongoose.connect(options.url, options.options)
    options.models && requireAll(options.models)
    callback && callback()
  }
}