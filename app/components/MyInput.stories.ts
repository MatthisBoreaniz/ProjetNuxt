import type { Meta, StoryObj } from '@storybook/vue3-vite'

import MyInput from './MyInput.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Components/Input',
  component: MyInput,
  render: (args) => ({
    components: { MyInput },
    setup() {
      return { args }
    },
    template: `
    <MyInput v-bind="args" />
  `,
  }),
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'email'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof MyInput>

export default meta
type Story = StoryObj<typeof meta>

export const Password: Story = {
  args: {
    type: 'text',
    label: 'Password',
  },
}

export const InputTextWithLabel: Story = {
  args: {
    label: 'text',
    type: 'text',
  },
}
