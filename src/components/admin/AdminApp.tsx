import React from 'react'
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import Dashboard from './Dashboard'
import {
  ProductList, ProductEdit, ProductCreate,
} from './resources/Products'
import { CategoryList } from './resources/Categories'
import { OrderList, OrderShow } from './resources/Orders'
import { CustomerList } from './resources/Customers'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CategoryIcon from '@mui/icons-material/Category'
import InventoryIcon from '@mui/icons-material/Inventory'

export default function AdminApp() {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      requireAuth
      darkTheme={{ palette: { mode: 'dark' } }}
    >
      <Resource name="products" list={ProductList} edit={ProductEdit} create={ProductCreate} icon={InventoryIcon} />
      <Resource name="categories" list={CategoryList} icon={CategoryIcon} />
      <Resource name="orders" list={OrderList} show={OrderShow} icon={ShoppingCartIcon} />
      <Resource name="customers" list={CustomerList} icon={PeopleIcon} />
    </Admin>
  )
}
