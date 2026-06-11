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

export const ThresholdFilter: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state showing Threshold filter with slider control (0-255).',
      },
    },
  },
}

export const HalftoneFilter: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Halftone filter with dot size control (1-20px).',
      },
    },
  },
}

export const PosterizeFilter: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Posterize filter with levels control (2-256).',
      },
    },
  },
}

export const PixelateFilter: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Pixelate filter with block size control (1-100px).',
      },
    },
  },
}
