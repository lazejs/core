import { App } from '../index'
import { User } from './models/User';

import config from './config'

const app = new App(config)

import { Auth } from '../middleware/auth'
const UserAuth = Auth({
  model: 'User'
})

app.route('/web/api', router => {
  router.get('/users', async (req, res) => {
    // await User.insertMany(Array(10).fill(1).map((v, k) => ({username: `user${k + 1}`})))
    res.send(await User.find())
  })
})

app.start(5000)