import { NextApiRequest, NextApiResponse } from 'next'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'

interface Worker {
  id: string
  worker: ChildProcess
}

interface WorkerPool {
  workers: Worker[]
  addWorker: (id: string, worker: ChildProcess) => void
  removeWorker: (id: string) => void
  getWorker: (id: string) => ChildProcess | undefined
}

export const workerPool: WorkerPool = {
  workers: [],
  addWorker(id, worker) {
    const newWorker = {
      id: id,
      worker: worker
    }
    this.workers.push(newWorker)
  },
  removeWorker(id) {
    this.workers = this.workers.filter((p) => p.id !== id)
  },
  getWorker(id) {
    const worker = this.workers.find((p) => p.id === id)?.worker

    return worker
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const id = '123'

  if (method === 'GET') {
    const isProcessing = workerPool.workers.some((w) => w.id === id)

    if (!isProcessing) {
      startProcess('123')
    }
    console.log(workerPool)

    res.status(200).json('Running')
  }

  if (method === 'POST') {
    const prompt = req.body
    console.log('prompt', prompt)

    console.log('Worker pool', workerPool)

    const worker = workerPool.workers.find((w) => w.id === id)?.worker

    if (!worker) {
      res.status(500).json('Something went wrong.')
      return
    }

    // worker.stdout?.on('data', (data) => {
    //   const output = data.toString()
    //   console.log(output)
    // })
    worker.stderr?.on('data', (data) => {
      const error = data.toString()
      console.log(error)
    })

    // const promptControl = new Transform({
    //   transform(chunk, encoding, callback) {
    //     const decoder = new TextDecoder()
    //     this.push(chunk)
    //     console.log('chunk', decoder.decode(chunk))

    //     callback()
    //   }
    // })
    // promptControl.pipe(worker.stdin!)
    worker.stdin?.write(prompt.replaceAll('\n', '\\') + '\r\n')
    worker.stdin?.end()

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Content-Encoding': 'none'
    })

    worker.stdout?.pipe(res)
  }

  if (method === 'DELETE') {
    const worker = workerPool.workers.find((w) => w.id === id)?.worker

    if (!worker) {
      res.status(500).json('Something went wrong.')
      return
    }

    const PID: string | undefined = worker.pid?.toString()
    console.log('PID', PID)

    if (!PID) {
      res.status(500).json('Something went wrong.')
      return
    }

    // spawn('taskkill', ['/pid', PID, '/f', '/t'])
    // spawn('kill', ['-9', PID])
    worker.stdin?.write('', () => process.exit(1))
    worker.on('exit', (code) => {
      console.log('Finished command. Exit code:', code)
      workerPool.removeWorker(id)
      console.log('Worker pool', workerPool)
    })
    workerPool.removeWorker(id)
    console.log(workerPool)

    res.status(200).json('Exited.')
  }
}

const startProcess = (id: string) => {
  const worker = spawn(
    'cd',
    [path.join(process.cwd(), '/llm'), '&&', './chat'],
    {
      shell: true
    }
  )

  workerPool.addWorker(id, worker)
}

type ProgressCallback = (output: string) => void

async function streamResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onProgress: ProgressCallback
): Promise<string> {
  return await new Promise((resolve) => {
    const decoder = new TextDecoder()
    let result = ''
    const readChunk = ({
      done,
      value
    }: ReadableStreamReadResult<Uint8Array>) => {
      if (done) {
        resolve(result)
        return
      }

      const output = decoder.decode(value)
      result += output
      onProgress(output)
      reader.read().then(readChunk)
    }

    reader.read().then(readChunk)
  })
}
