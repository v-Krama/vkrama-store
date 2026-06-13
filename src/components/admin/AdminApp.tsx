import React from 'react'

declare global {
  interface Window { __adm: any }
}

export default function AdminApp() {
  const [msg, setMsg] = React.useState('Starting...')

  React.useEffect(() => {
    setMsg('useEffect ran')

    async function check() {
      try {
        setMsg('Importing react-admin...')
        const ra = await import('react-admin')
        window.__adm = ra
        setMsg(`Loaded! Exports: ${Object.keys(ra).slice(0,15).join(', ')}...`)
      } catch (e: any) {
        setMsg(`ERROR: ${e.message}\n${e.stack}`)
      }
    }
    check()
  }, [])

  return React.createElement('div', {
    style: {
      padding: '40px',
      fontFamily: 'monospace',
      fontSize: '14px',
      whiteSpace: 'pre-wrap',
      maxWidth: '100%',
      overflow: 'auto',
      background: '#fff',
      color: '#333',
      minHeight: '100vh'
    }
  }, msg)
}
