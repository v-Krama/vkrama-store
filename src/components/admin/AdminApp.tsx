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

const MyLayout = ({ children }) => React.createElement('div', { style: { minHeight: '100vh', background: '#fff' } },
  React.createElement(Typography, { variant: 'h5', sx: { p: 2, bgcolor: '#1976d2', color: 'white' } }, 'Admin Panel'),
  React.createElement('div', { style: { padding: 20 } }, children)
)

export default function AdminApp() {
  return React.createElement('div', { style: { minHeight: '100vh' } },
    React.createElement(Admin, {
      basename: '/admin',
      dataProvider,
      authProvider,
      requireAuth: false,
      layout: MyLayout,
    },
      React.createElement(Resource, {
        name: 'products',
        list: () => React.createElement('div', null, 'Products List'),
      }),
    )
  )
}
