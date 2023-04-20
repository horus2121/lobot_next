import Head from 'next/head'
import { PromptForm } from '@/components/prompt-form'
import { Box } from '@/components/box'
import { styled } from '@stitches/react'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/tabs'
import { Output } from '@/components/output'
import { useState } from 'react'

const Text = styled('p', {
  fontFamily: '$system',
  color: '$hiContrast'
})

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  marginY: 0,
  margin: 'auto',
  padding: '$3',
  paddingY: 0,

  variants: {
    size: {
      1: {
        maxWidth: '300px'
      },
      2: {
        maxWidth: '585px'
      },
      3: {
        maxWidth: '865px'
      }
    }
  }
})

export default function Home() {
  const [promptOutput, setPromptOutput] = useState('')

  async function streamResponse(
    reader: ReadableStreamDefaultReader<Uint8Array>
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

        const output = decoder
          .decode(value)
          .replaceAll('[33m', '')
          .replaceAll('[32m', '')
          .replaceAll('[1m', '')
          .replaceAll('[0m', '')
        result += output
        setPromptOutput((prev) => prev + output)
        reader.read().then(readChunk)
      }

      reader.read().then(readChunk)
    })
  }
  const chat = async (prompt: string) => {
    const res = await fetch(`/api/lobot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: prompt
    })
    const reader = res.body?.getReader()

    if (reader) {
      const result = await streamResponse(reader)
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

  const handleStart = async () => {
    const res = await (await fetch('/api/lobot')).json()

    console.log(res)
  }

  const handleExit = async () => {
    const res = await (
      await fetch('/api/lobot', {
        method: 'DELETE'
      })
    ).json()

    console.log(res)
  }

  return (
    <Box css={{ paddingY: '$6' }}>
      <Head>
        <title>Lobot.</title>
      </Head>
      <Container size={{ '@initial': '1', '@bp1': '2' }}>
        <Text as="h1">Lobot.</Text>
        <TabsRoot>
          <TabsList>
            <TabsTrigger value="alpaca">Alpaca</TabsTrigger>
            <TabsTrigger value="llama">Llama</TabsTrigger>
          </TabsList>
          <PromptForm onSubmit={chat}></PromptForm>
          <TabsContent value="alpaca">
            <Output>{promptOutput ? promptOutput : 'Alpaca!'}</Output>
          </TabsContent>
          <TabsContent value="llama">
            <Output>You are using Llama model.</Output>
          </TabsContent>
        </TabsRoot>
        <button onClick={handleStart}>start</button>
        <button onClick={handleExit}>Exit</button>
      </Container>
    </Box>
  )
}
