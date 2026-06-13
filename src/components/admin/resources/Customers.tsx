import React from 'react'
import {
  List, Datagrid, TextField, DateField, SearchInput,
} from 'react-admin'

const customerFilters = [<SearchInput source="q" alwaysOn key="q" />]

export const CustomerList = () => (
  <List filters={customerFilters}>
    <Datagrid bulkActionButtons={false}>
      <TextField source="email" label="Email" />
      <TextField source="name" label="Name" />
      <TextField source="phone" label="Phone" />
      <DateField source="created_at" label="Registered" />
    </Datagrid>
  </List>
)
