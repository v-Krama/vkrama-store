import React from 'react'
import { Admin, Resource } from 'react-admin'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import Dashboard from './Dashboard'
import { ProductList, ProductEdit, ProductCreate } from './resources/Products'
import { CategoryList } from './resources/Categories'
import { OrderList, OrderShow } from './resources/Orders'
import { CustomerList } from './resources/Customers'

export default function AdminApp() {
  return React.createElement('div', { style: { minHeight: '100vh' } },
    React.createElement(Admin, {
      basename: '/admin',
      dataProvider,
      authProvider,
      requireAuth: true,
      dashboard: Dashboard,
    },
      React.createElement(Resource, {
        name: 'products',
        list: ProductList,
        edit: ProductEdit,
        create: ProductCreate,
      }),
      React.createElement(Resource, {
        name: 'categories',
        list: CategoryList,
      }),
      React.createElement(Resource, {
        name: 'orders',
        list: OrderList,
        show: OrderShow,
      }),
      React.createElement(Resource, {
        name: 'customers',
        list: CustomerList,
      }),
    )
  )
}
