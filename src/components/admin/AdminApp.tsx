import React from 'react'
import { Admin, Resource } from 'react-admin'

const dataProvider = {
  getList: () => Promise.resolve({ data: [], total: 0 }),
  getOne: () => Promise.resolve({ data: {} }),
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  create: () => Promise.resolve({ data: {} }),
  update: () => Promise.resolve({ data: {} }),
  updateMany: () => Promise.resolve({ data: [] }),
  delete: () => Promise.resolve({ data: {} }),
  deleteMany: () => Promise.resolve({ data: [] }),
}

const authProvider = {
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(null),
}

export default function AdminApp() {
  const [phase, setPhase] = React.useState('initial')
  const [el, setEl] = React.useState<React.ReactNode>(null)

  React.useEffect(() => {
    setPhase('effect fired')
    try {
      const adminEl = React.createElement(Admin, {
        basename: '/admin',
        dataProvider,
        authProvider,
        requireAuth: false,
        layout: ({ children }) => React.createElement('div', { style: { background: '#ff0000', minHeight: '100vh' } },
          React.createElement('div', { style: { padding: 20, color: 'white', fontSize: 18 } }, 'LAYOUT RENDERED'),
          children
        ),
      },
        React.createElement(Resource, { name: 'products', list: () => React.createElement('div', { style: { padding: 20 } }, 'PRODUCTS PAGE') }),
      )
      setEl(adminEl)
      setPhase('element created, triggering re-render')
    } catch (e: any) {
      setPhase('ERROR creating element: ' + e.message)
    }
  }, [])

  if (phase.includes('ERROR')) {
    return React.createElement('pre', { style: { color: 'red', padding: 40, fontFamily: 'monospace', background: '#fff', minHeight: '100vh' } }, phase)
  }

  if (!el) {
    return React.createElement('div', { style: { padding: 40, background: '#ff0', minHeight: '100vh' } },
      'Loading Admin... Phase: ' + phase
    )
  }

  try {
    return el
  } catch (e: any) {
    return React.createElement('pre', { style: { color: 'red', padding: 40 } }, 'Render error: ' + e.message)
  }
}
