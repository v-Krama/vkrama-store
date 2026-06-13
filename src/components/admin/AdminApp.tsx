import React from 'react'
import { Admin, Resource, ListGuesser } from 'react-admin'

const dataProvider = {
  getList: (resource, params) => {
    console.log('RA getList', resource, params)
    return Promise.resolve({ data: [], total: 0 })
  },
  getOne: () => Promise.resolve({ data: { id: '1' } }),
  getMany: (resource, ids) => Promise.resolve({ data: ids.map(id => ({ id })) }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  create: () => Promise.resolve({ data: { id: 'new' } }),
  update: () => Promise.resolve({ data: { id: '1' } }),
  updateMany: () => Promise.resolve({ data: [] }),
  delete: () => Promise.resolve({ data: { id: '1' } }),
  deleteMany: () => Promise.resolve({ data: [] }),
}

const authProvider = {
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(null),
}

const MyLayout = ({ children }) => React.createElement('div', {
  style: { background: '#ff0000', color: 'white', padding: 40, minHeight: '100vh' }
}, children)

export default function AdminApp() {
  console.log('AdminApp render start')

  const el = React.createElement('div', { style: { background: '#ff0000', minHeight: '100vh' } },
    React.createElement(Admin, {
      basename: '/admin',
      dataProvider,
      authProvider,
      requireAuth: false,
      layout: MyLayout,
    },
      React.createElement(Resource, { name: 'products', list: ListGuesser })
    )
  )

  console.log('AdminApp render done')
  return el
}
