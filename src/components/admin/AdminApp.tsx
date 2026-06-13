import React from 'react'

export default function AdminApp() {
  const [el, setEl] = React.useState<React.ReactElement | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      try {
        const { Admin, Resource } = await import('react-admin')
        const { dataProvider } = await import('./dataProvider')
        const { authProvider } = await import('./authProvider')

        const safeAuth = {
          ...authProvider,
          checkAuth: async () => {
            const token = localStorage.getItem('vkrama_admin_token')
            if (!token) throw new Error('Not authenticated')
          },
        }

        setEl(React.createElement(Admin, {
          basename: '/admin',
          dataProvider,
          authProvider: safeAuth,
        },
          React.createElement(Resource, {
            name: 'products',
            list: () => React.createElement('div', null, 'Products List Here')
          })
        ))
      } catch (err: any) {
        setError(err?.stack || String(err))
      }
    }
    load()
  }, [])

  if (error) {
    return React.createElement('pre', {
      style: { padding: 40, color: 'red', fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxWidth: '100%', overflow: 'auto' }
    }, error)
  }

  if (!el) {
    return React.createElement('div', { style: { padding: 40, textAlign: 'center' } }, 'Loading admin...')
  }

  return el
}
