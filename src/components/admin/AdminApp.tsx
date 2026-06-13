import React from 'react'
import { Admin, Resource } from 'react-admin'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'

const MyLayout = ({ children }: any) => React.createElement('div', {
  style: { display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }
},
  React.createElement('aside', {
    style: { width: 240, background: '#1e293b', color: '#fff', padding: '20px 0', flexShrink: 0 }
  },
    React.createElement('div', { style: { padding: '0 20px 20px', fontSize: 18, fontWeight: 700, borderBottom: '1px solid #334155' } }, 'Vkrama Admin'),
    React.createElement('nav', { style: { padding: 10 } },
      ['products', 'categories', 'orders', 'customers'].map(r =>
        React.createElement('a', {
          key: r,
          href: `/admin/${r}`,
          style: { display: 'block', padding: '10px 20px', color: '#cbd5e1', textDecoration: 'none', textTransform: 'capitalize', borderRadius: 6 }
        }, r)
      )
    )
  ),
  React.createElement('main', { style: { flex: 1, background: '#f8fafc', padding: 30, overflow: 'auto' } }, children)
)

function MyDashboard() {
  return React.createElement('div', null,
    React.createElement('h1', { style: { fontSize: 24, fontWeight: 700, marginBottom: 20 } }, 'Dashboard'),
    React.createElement('div', { style: { display: 'flex', gap: 16, flexWrap: 'wrap' } },
      React.createElement('div', { style: { flex: '1 1 200px', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
        React.createElement('div', { style: { fontSize: 14, color: '#64748b' } }, 'Welcome to Vkrama Admin'),
        React.createElement('div', { style: { fontSize: 14, marginTop: 8, color: '#334155' } }, 'Select a resource from the sidebar.')
      )
    )
  )
}

function MyLoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authProvider.login({ username: email, password })
      window.location.href = '/admin'
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }
  },
    React.createElement('form', {
      onSubmit: handleSubmit,
      style: { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: 360, maxWidth: '90%' }
    },
      React.createElement('h1', { style: { fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' } }, 'Vkrama Admin'),
      error && React.createElement('div', {
        style: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 14 }
      }, error),
      React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Email'),
        React.createElement('input', {
          type: 'email', value: email, required: true,
          onChange: e => setEmail(e.target.value),
          style: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
        })
      ),
      React.createElement('div', { style: { marginBottom: 24 } },
        React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Password'),
        React.createElement('input', {
          type: 'password', value: password, required: true,
          onChange: e => setPassword(e.target.value),
          style: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
        })
      ),
      React.createElement('button', {
        type: 'submit', disabled: loading,
        style: { width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }
      }, loading ? 'Signing in...' : 'Sign In')
    )
  )
}

export default function AdminApp() {
  return React.createElement('div', { style: { minHeight: '100vh' } },
    React.createElement(Admin, {
      basename: '/admin',
      dataProvider,
      authProvider,
      requireAuth: true,
      layout: MyLayout,
      dashboard: MyDashboard,
      loginPage: MyLoginPage,
    },
      React.createElement(Resource, { name: 'products', list: () => React.createElement('div', null, 'Products') }),
      React.createElement(Resource, { name: 'categories', list: () => React.createElement('div', null, 'Categories') }),
      React.createElement(Resource, { name: 'orders', list: () => React.createElement('div', null, 'Orders') }),
      React.createElement(Resource, { name: 'customers', list: () => React.createElement('div', null, 'Customers') }),
    )
  )
}
