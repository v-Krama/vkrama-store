import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const theme = createTheme()

export default function AdminApp() {
  try {
    return React.createElement(ThemeProvider, { theme },
      React.createElement('div', { style: { padding: 40, background: '#fff', minHeight: '100vh' } },
        React.createElement(Typography, { variant: 'h1' }, 'MUI Works!'),
        React.createElement(Typography, { variant: 'body1' }, 'This text uses MUI Typography'),
      )
    )
  } catch (e) {
    return React.createElement('pre', { style: { color: 'red', padding: 40 } }, 'MUI error: ' + e.message)
  }
}
