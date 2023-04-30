import Head from 'next/head'
import { PromptForm } from '@/components/prompt-form'
import { Box } from '@/components/box'
import { styled } from '@stitches/react'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/tabs'
import { Output } from '@/components/output'
import { useState } from 'react'
import { handleInstruction } from '@/utils/api-client'

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
  const [msgOutput, setMsgOutput] = useState('')

  const sendMessage = async (msg: string) => {
    await handleInstruction(msg, (output: string) =>
      setMsgOutput((prev) => prev + output)
    )
  }

  const test = async () => {
    await fetch('/api/lobot')
  }

  return (
    <Box css={{ paddingY: '$6' }}>
      <Head>
        <title>Lobot.</title>
      </Head>
      <Container size={{ '@initial': '1', '@bp1': '2' }}>
        <Text as="h1">Lobot. &#129302;</Text>
        <TabsRoot defaultValue="alpaca">
          <TabsList>
            <TabsTrigger value="alpaca">Alpaca</TabsTrigger>
            <TabsTrigger value="summary">Artical Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="alpaca">
            <PromptForm onSubmit={sendMessage}></PromptForm>
            <Output>{msgOutput ? msgOutput : 'Hi there!'}</Output>
          </TabsContent>
          <TabsContent value="summary">
            <Output>Provide an article.</Output>
            <button onClick={test}>Test</button>
          </TabsContent>
        </TabsRoot>
      </Container>
    </Box>
  )
}
