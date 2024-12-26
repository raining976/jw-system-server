import express from 'express'
import path from 'path'
const app = express()
import bodyParser from 'body-parser'
const port = 3000

import api_router from './routes/api.js'
import error from './routes/error.js'


import cors from 'cors'

app.use(cors())
app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})

api_router(app)
error(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
