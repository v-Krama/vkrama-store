import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useGetList } from 'react-admin'

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <Card sx={{ borderRadius: 3, flex: '1 1 200px', minWidth: 220 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${color}15`, color }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { total: totalOrders } = useGetList('orders', { pagination: { page: 1, perPage: 1 } })
  const { total: totalCustomers } = useGetList('customers', { pagination: { page: 1, perPage: 1 } })
  const { total: totalProducts } = useGetList('products', { pagination: { page: 1, perPage: 1 } })
  const [revenue, setRevenue] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('vkrama_admin_token')
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setRevenue(d.revenueCents || d.totalRevenue || 0))
      .catch(() => {})
  }, [])

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Dashboard</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <StatCard icon={<AttachMoneyIcon />} label="Revenue" value={`Rs. ${(revenue / 100).toLocaleString()}`} color="#10b981" />
        <StatCard icon={<ShoppingCartIcon />} label="Total Orders" value={String(totalOrders || 0)} color="#6366f1" />
        <StatCard icon={<PeopleIcon />} label="Customers" value={String(totalCustomers || 0)} color="#f59e0b" />
        <StatCard icon={<InventoryIcon />} label="Products" value={String(totalProducts || 0)} color="#3b82f6" />
      </Box>
    </Box>
  )
}
