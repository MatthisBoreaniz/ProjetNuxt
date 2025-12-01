// import type { Meta, StoryObj } from '@storybook/vue3-vite'

// import MyTitle from './MyTitle.vue'

// const meta = {
//   title: 'Components/Title',
//   component: MyTitle,
//   render: (args) => ({
//     components: { MyTitle },
//     setup () {
//       return { args }
//     },
//     template: `
//     <MyTitle v-bind="args">{{ args.default || 'Example title' }}</MyTitle>
//   `
//   }),
//   tags: ['autodocs'],
//   argTypes: {
//     level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
//     size: { control: 'select', options: ['giant', 'large', 'medium', 'small', 'tiny'] },
//     variant: { control: 'radio', options: ['default', 'muted', 'accent'] },
//     uppercase: { control: 'boolean' },
//     center: { control: 'boolean' },
//     default: { control: 'text' }
//   }
// } satisfies Meta<typeof MyTitle>

// export default meta
// type Story = StoryObj<typeof meta>

// export const Default: Story = {
//   args: {
//     level: 1,
//     size: 'large',
//     variant: 'default',
//     uppercase: false,
//     center: false,
//     default: 'Hello World'
//   }
// }

// export const Muted: Story = {
//   args: {
//     variant: 'muted',
//     default: 'Muted title'
//   }
// }

// export const Accent: Story = {
//   args: {
//     variant: 'accent',
//     default: 'Accent title'
//   }
// }

// export const Giant: Story = {
//   args: {
//     size: 'giant',
//     default: 'Giant title'
//   }
// }

// export const Small: Story = {
//   args: {
//     size: 'small',
//     default: 'Small title'
//   }
// }

// export const Uppercase: Story = {
//   args: {
//     uppercase: true,
//     default: 'Uppercase title'
//   }
// }

// export const Centered: Story = {
//   args: {
//     center: true,
//     default: 'Centered title'
//   }
// }

// export const Level3: Story = {
//   args: {
//     level: 3,
//     default: 'Level 3 title'
//   }
// }
