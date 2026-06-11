import type { Meta, StoryObj } from '@storybook/react'
import GridPreview from '../components/GridPreview'

const meta: Meta<typeof GridPreview> = {
  title: 'Components/GridPreview',
  component: GridPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof GridPreview>

export const Default: Story = {
  args: {
    imageId: 'test-123.png',
  },
}

export const WithGrid: Story = {
  args: {
    imageId: 'test-123.png',
  },
  decorators: [
    (Story) => {
      return <Story />
    },
  ],
}
