import React from 'react'
import {
  List, Datagrid, TextField, NumberField, Edit, Create,
  SimpleForm, TextInput, NumberInput, SelectInput, DateField,
  EditButton, ShowButton, FilterForm, ReferenceInput,
  ImageField, useRecordContext, TopToolbar, SearchInput,
} from 'react-admin'
import { Card, CardContent, Typography, Box, Stack } from '@mui/material'

const productFilters = [
  <SearchInput source="q" alwaysOn key="q" />,
  <SelectInput source="status" choices={[
    { id: 'active', name: 'Active' },
    { id: 'draft', name: 'Draft' },
    { id: 'archived', name: 'Archived' },
  ]} key="status" />,
]

export const ProductList = () => (
  <List filters={productFilters} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="name" label="Name" />
      <NumberField source="priceCents" label="Price" options={{ style: 'currency', currency: 'NPR', minimumFractionDigits: 2 }} transform={(v: number) => v / 100} />
      <NumberField source="stock" label="Stock" />
      <TextField source="status" label="Status" />
      <DateField source="created_at" label="Created" />
      <EditButton />
    </Datagrid>
  </List>
)

export const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <TextInput source="slug" fullWidth />
      <TextInput source="description" multiline rows={4} fullWidth />
      <NumberInput source="priceCents" label="Price (cents)" />
      <NumberInput source="compareAtPriceCents" label="Compare At Price (cents)" />
      <NumberInput source="costCents" label="Cost (cents)" />
      <NumberInput source="stock" label="Stock" />
      <TextInput source="imageUrl" label="Image URL" fullWidth />
      <SelectInput source="status" choices={[
        { id: 'draft', name: 'Draft' },
        { id: 'active', name: 'Active' },
        { id: 'archived', name: 'Archived' },
      ]} />
    </SimpleForm>
  </Edit>
)

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <TextInput source="slug" fullWidth />
      <TextInput source="description" multiline rows={4} fullWidth />
      <NumberInput source="priceCents" label="Price (cents)" />
      <NumberInput source="compareAtPriceCents" label="Compare At Price (cents)" />
      <NumberInput source="costCents" label="Cost (cents)" />
      <NumberInput source="stock" label="Stock" />
      <TextInput source="imageUrl" label="Image URL" fullWidth />
      <SelectInput source="status" choices={[
        { id: 'draft', name: 'Draft' },
        { id: 'active', name: 'Active' },
        { id: 'archived', name: 'Archived' },
      ]} />
    </SimpleForm>
  </Create>
)
