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

export const SmallGrid: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid preview with small dimensions (10x10).',
      },
    },
  },
}

export const MediumGrid: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid preview with medium dimensions (20x20).',
      },
    },
  },
}

export const LargeGrid: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid preview with large dimensions (40x40).',
      },
    },
  },
}

export const ExportReady: Story = {
  args: {
    imageId: 'test-123.png',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid preview showing export options (SVG, PNG, PDF).',
      },
    },
  },
}
