import React from 'react'
import {
  List, Datagrid, TextField, Edit, Create,
  SimpleForm, TextInput, DateField, EditButton, SearchInput,
} from 'react-admin'

const categoryFilters = [<SearchInput source="q" alwaysOn key="q" />]

export const CategoryList = () => (
  <List filters={categoryFilters}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="name" label="Name" />
      <TextField source="slug" label="Slug" />
      <TextField source="description" label="Description" />
      <DateField source="created_at" label="Created" />
      <EditButton />
    </Datagrid>
  </List>
)
