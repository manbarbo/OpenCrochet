import type { Meta, StoryObj } from '@storybook/react'
import ImagePreview from '../components/ImagePreview'

const meta: Meta<typeof ImagePreview> = {
  title: 'Components/ImagePreview',
  component: ImagePreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ImagePreview>

export const OriginalOnly: Story = {
  args: {
    originalImageId: 'original.png',
    showOriginal: true,
    showProcessed: false,
    title: 'Original Image',
  },
}

export const ProcessedOnly: Story = {
  args: {
    originalImageId: 'original.png',
    processedImageUrl: 'processed.png',
    showOriginal: false,
    showProcessed: true,
    title: 'Processed Image',
  },
}

export const SideBySide: Story = {
  args: {
    originalImageId: 'original.png',
    processedImageUrl: 'processed.png',
    showOriginal: true,
    showProcessed: true,
    title: 'Before & After',
  },
}

export const NoImages: Story = {
  args: {
    originalImageId: '',
    processedImageUrl: undefined,
    showOriginal: true,
    showProcessed: true,
    title: 'Empty State',
  },
}
