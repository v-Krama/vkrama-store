import React from 'react'
import {
  List, Datagrid, TextField, NumberField, DateField,
  Show, SimpleShowLayout, ShowButton, SelectInput, SearchInput,
  ArrayField, SingleFieldList, ChipField,
} from 'react-admin'
import { Card, CardContent, Typography, Stack, Box } from '@mui/material'

const orderFilters = [
  <SearchInput source="q" alwaysOn key="q" />,
  <SelectInput source="status" choices={[
    { id: 'pending', name: 'Pending' },
    { id: 'paid', name: 'Paid' },
    { id: 'processing', name: 'Processing' },
    { id: 'shipped', name: 'Shipped' },
    { id: 'delivered', name: 'Delivered' },
    { id: 'cancelled', name: 'Cancelled' },
  ]} key="status" />,
]

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  paid: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#3b82f6',
  delivered: '#10b981',
  cancelled: '#ef4444',
}

export const OrderList = () => (
  <List filters={orderFilters} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="Order ID" />
      <TextField source="email" label="Customer" />
      <NumberField source="totalCents" label="Total" options={{ style: 'currency', currency: 'NPR', minimumFractionDigits: 2 }} transform={(v: number) => v / 100} />
      <TextField source="paymentMethod" label="Payment" />
      <TextField source="status" label="Status" />
      <DateField source="created_at" label="Date" />
      <ShowButton />
    </Datagrid>
  </List>
)

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Order ID" />
      <TextField source="email" label="Email" />
      <TextField source="phone" label="Phone" />
      <NumberField source="totalCents" label="Total" options={{ style: 'currency', currency: 'NPR', minimumFractionDigits: 2 }} transform={(v: number) => v / 100} />
      <TextField source="status" label="Status" />
      <TextField source="paymentMethod" label="Payment Method" />
      <TextField source="shippingName" label="Shipping Name" />
      <TextField source="shippingPhone" label="Shipping Phone" />
      <TextField source="shippingLine1" label="Address Line 1" />
      <TextField source="shippingCity" label="City" />
      <TextField source="shippingState" label="State" />
      <TextField source="created_at" label="Order Date" />
    </SimpleShowLayout>
  </Show>
)
