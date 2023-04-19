import React from 'react'
import * as Form from '@radix-ui/react-form'
import { styled } from '@stitches/react'

export const PromptForm = () => (
  <FormRoot>
    <FormField name="email">
      <Flex css={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <FormLabel>Prompt</FormLabel>
        <FormMessage match="valueMissing">Please enter your prompt</FormMessage>
        <FormMessage match="typeMismatch">
          Please provide a valid prompt
        </FormMessage>
      </Flex>
      <Form.Control asChild>
        <Input type="email" required />
      </Form.Control>
    </FormField>
    <Form.Submit asChild>
      <Button css={{ marginTop: 10 }}>Send prompt</Button>
    </Form.Submit>
  </FormRoot>
)

const FormRoot = styled(Form.Root, {})

const FormField = styled(Form.Field, {
  display: 'grid',
  marginBottom: 10
})

const FormLabel = styled(Form.Label, {
  fontSize: 15,
  fontWeight: 500,
  lineHeight: '35px',
  color: '$foreground'
})

const FormMessage = styled(Form.Message, {
  fontSize: 13,
  color: '$red600',
  opacity: 0.8
})

const Flex = styled('div', { display: 'flex' })

const inputStyles = {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,

  fontSize: 15,
  color: '$foreground',
  backgroundColor: '$gray300',
  boxShadow: `0 0 0 1px $gray400`,
  '&:hover': { boxShadow: `0 0 0 1px $gray400` },
  '&:focus': { boxShadow: `0 0 0 2px $gray400` },
  '&::selection': { backgroundColor: '$gray400', color: 'white' }
}

const Input = styled('input', {
  ...inputStyles,
  height: 35,
  lineHeight: 1,
  padding: '0 10px'
})

const Button = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,
  width: '100%',

  backgroundColor: '$purple500',
  color: 'white',
  boxShadow: `0 2px 10px $gray400`,
  '&:hover': { backgroundColor: '$purple600' },
  '&:focus': { boxShadow: `0 0 0 2px black` }
})
