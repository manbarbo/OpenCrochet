import type { Meta, StoryObj } from '@storybook/react'
import FilterPanel from '../components/FilterPanel'

const meta: Meta<typeof FilterPanel> = {
  title: 'Components/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FilterPanel>

export const Default: Story = {
  args: {
    imageId: 'test-123.png',
  },
}

export const WithProcessedImage: Story = {
  args: {
    imageId: 'test-123.png',
  },
  decorators: [
    (Story) => {
      // Mock the processed image state
      return <Story />
    },
  ],
}
