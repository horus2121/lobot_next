import { NextApiRequest, NextApiResponse } from 'next'
import { workerPool } from '.'

export default function GET(req: NextApiRequest, res: NextApiResponse) {
  const id = '123'

  console.log(workerPool)

  const worker = workerPool.workers.find((w) => w.id === id)?.worker

  if (!worker) {
    res.status(500).json('Something went wrong.')
    return
  }

  worker.kill()
  workerPool.removeWorker(id)

  res.status(200).json('Exited.')
}
