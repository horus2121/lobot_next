type ProgressCallback = (output: string) => void

export async function handleInstruction(
  instruction: string,
  cb: ProgressCallback
) {
  cb('Me: ' + instruction)
  const res = await fetch(`/api/lobot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    },
    body: instruction
  })
  const reader = res.body?.getReader()

  cb('\nAlpaca: ')
  if (reader) {
    const result = await streamResponse(reader, cb)
    return result
      .split('\n')
      .filter((line) => {
        return !line.startsWith('[Error]')
      })
      .join('\n')
  } else {
    return false
  }
}

async function streamResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  cb: ProgressCallback
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

      const output = decoder.decode(value).replaceAll('<end>', '---')
      result += output
      cb(output)
      reader.read().then(readChunk)
    }

    reader.read().then(readChunk)
  })
}
