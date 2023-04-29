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
  const [insOutput, setInsOutput] = useState('')

  const sendInstruction = async (instruction: string) => {
    await handleInstruction(instruction, (output: string) =>
      setInsOutput((prev) => prev + output)
    )
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
          <PromptForm onSubmit={sendInstruction}></PromptForm>
          <TabsContent value="alpaca">
            <Output>{insOutput ? insOutput : 'Alpaca!'}</Output>
          </TabsContent>
          <TabsContent value="summary">
            <Output>Provide an article.</Output>
          </TabsContent>
        </TabsRoot>
      </Container>
    </Box>
  )
}
