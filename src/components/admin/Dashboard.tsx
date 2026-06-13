import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { useGetList } from 'react-admin'

export default function Dashboard() {
  const { total: totalOrders } = useGetList('orders', { pagination: { page: 1, perPage: 1 } })
  const { total: totalCustomers } = useGetList('customers', { pagination: { page: 1, perPage: 1 } })
  const { total: totalProducts } = useGetList('products', { pagination: { page: 1, perPage: 1 } })
  const [revenue, setRevenue] = React.useState(0)

  React.useEffect(() => {
    const token = localStorage.getItem('vkrama_admin_token')
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setRevenue(d.revenueCents || d.totalRevenue || 0))
      .catch(() => {})
  }, [])

  return React.createElement(Box, null,
    React.createElement(Typography, { variant: 'h5', fontWeight: 700, mb: 3 }, 'Dashboard'),
    React.createElement(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 3 } },
      React.createElement('div', { style: { flex: '1 1 200px', minWidth: 220, background: '#f0fdf4', borderRadius: 12, padding: 24 } },
        React.createElement(Typography, { variant: 'h4', fontWeight: 700 }, `Rs. ${(revenue / 100).toLocaleString()}`),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 'Revenue')
      ),
      React.createElement('div', { style: { flex: '1 1 200px', minWidth: 220, background: '#eef2ff', borderRadius: 12, padding: 24 } },
        React.createElement(Typography, { variant: 'h4', fontWeight: 700 }, String(totalOrders || 0)),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 'Total Orders')
      ),
      React.createElement('div', { style: { flex: '1 1 200px', minWidth: 220, background: '#fefce8', borderRadius: 12, padding: 24 } },
        React.createElement(Typography, { variant: 'h4', fontWeight: 700 }, String(totalCustomers || 0)),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 'Customers')
      ),
      React.createElement('div', { style: { flex: '1 1 200px', minWidth: 220, background: '#eff6ff', borderRadius: 12, padding: 24 } },
        React.createElement(Typography, { variant: 'h4', fontWeight: 700 }, String(totalProducts || 0)),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, 'Products')
      )
    )
  )
}
