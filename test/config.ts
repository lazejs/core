import { Laze } from "../laze";

import * as dotenv from 'dotenv'
dotenv.config()

const options:Laze.AppOptions = {
  db: {
    url: process.env.DB_URL,
    models: __dirname + '/models'
  }
}

export default options