import React from 'react'
import { Admin, Resource } from 'react-admin'
import Typography from '@mui/material/Typography'

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

function MyDashboard() {
  return React.createElement('div', { style: { background: '#ff0000', color: 'white', padding: 40, fontSize: 24 } },
    'DASHBOARD IS VISIBLE'
  )
}

const MyLayout = ({ children }) => React.createElement('div', { style: { background: '#ff0', minHeight: '100vh', padding: 20 } },
  React.createElement(Typography, { variant: 'h5', sx: { fontWeight: 700 } }, 'ADMIN HEADER'),
  children
)

export default function AdminApp() {
  return React.createElement('div', { style: { minHeight: '100vh' } },
    React.createElement(Admin, {
      basename: '/admin',
      dataProvider,
      authProvider,
      requireAuth: false,
      layout: MyLayout,
      dashboard: MyDashboard,
    },
      React.createElement(Resource, { name: 'products', list: () => React.createElement('div', { style: { padding: 20 } }, 'PRODUCTS PAGE') }),
      React.createElement(Resource, { name: 'orders', list: () => React.createElement('div', { style: { padding: 20 } }, 'ORDERS PAGE') }),
    )
  )
}
