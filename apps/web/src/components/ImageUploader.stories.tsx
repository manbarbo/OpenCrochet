import type { Meta, StoryObj } from '@storybook/react'
import ImageUploader from '../components/ImageUploader'

const meta: Meta<typeof ImageUploader> = {
  title: 'Components/ImageUploader',
  component: ImageUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ImageUploader>

export const Default: Story = {
  args: {
    onUpload: (imageId: string) => console.log('Uploaded:', imageId),
  },
}

export const WithoutCallback: Story = {
  args: {},
}
