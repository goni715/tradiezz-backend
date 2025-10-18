import type { Request, Response } from "express"
import app from "./app"

const port = 3000

app.get('/', (req:Request, res: Response) => {
  res.send('Hello World Goni Hales what do you want!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
