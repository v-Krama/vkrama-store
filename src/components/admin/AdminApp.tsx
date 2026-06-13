import React from 'react'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return React.createElement('pre', {
        style: { color: 'red', padding: 40, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }
      }, this.state.error.stack || this.state.error.message)
    }
    return this.props.children
  }
}

export default function AdminApp() {
  const [el, setEl] = React.useState<React.ReactNode>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    import('react-admin').then(ra => {
      const emptyAuth = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(null),
      }
      const emptyData: any = {}
      for (const m of ['getList','getOne','getMany','getManyReference','create','update','updateMany','delete','deleteMany']) {
        emptyData[m] = () => Promise.resolve({ data: [] })
      }
      emptyData.getList = () => Promise.resolve({ data: [], total: 0 })
      emptyData.getOne = () => Promise.resolve({ data: { id: '1' } })

      setEl(React.createElement(ra.Admin, {
        basename: '/admin',
        dataProvider: emptyData,
        authProvider: emptyAuth,
        requireAuth: false,
        disableTelemetry: true,
      },
        React.createElement(ra.Resource, {
          name: 'products',
          list: () => React.createElement('div', { style: { padding: 20 } }, 'Products work!'),
        })
      ))
    }).catch((e: any) => {
      setError(e?.stack || String(e))
    })
  }, [])

  if (error) return React.createElement('pre', { style: { color: 'red', padding: 40, fontFamily: 'monospace' } }, error)
  if (!el) return React.createElement('div', { style: { padding: 40 } }, 'Loading...')

  return React.createElement(ErrorBoundary, null, el)
}
