import type { Preview } from '@storybook/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'

const theme = createTheme()

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      React.createElement(ThemeProvider, { theme },
        React.createElement(CssBaseline, null),
        React.createElement(Story, null)
      )
    ),
  ],
}

export default preview
