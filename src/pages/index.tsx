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
            <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
          </TabsList>
          <PromptForm></PromptForm>
          <TabsContent value="alpaca">
            <Output>You're using Alpace model.</Output>
          </TabsContent>
          <TabsContent value="chatgpt">
            <Output>You're using ChatGPT model.</Output>
          </TabsContent>
        </TabsRoot>
      </Container>
    </Box>
  )
}
