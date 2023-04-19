import { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'
import path from 'path'

export default function POST(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body

  const cmd = spawn(
    'cd',
    [path.join(process.cwd(), 'src/llm/'), '&&', './chat'],
    {
      shell: true
    }
  )

  cmd.stdout.on('data', (data) => {
    const output = data.toString()
    console.log(output)
  })
  cmd.stderr.on('data', (data) => {
    const error = data.toString()
    console.log(error)
  })
  cmd.on('close', (code) => {
    console.log('Finished command. Exit code:', code)
  })

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-cache',
    'Content-Encoding': 'none'
  })

  cmd.stdout.pipe(res)
}
