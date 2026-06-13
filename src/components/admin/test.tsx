import React from 'react'

export default function Test() {
  return React.createElement('div', { style: { padding: 40, textAlign: 'center' as const } },
    React.createElement('h1', null, 'Vkrama Admin'),
    React.createElement('p', null, 'React Admin is loading...'),
    React.createElement('div', { style: { marginTop: 20, color: '#666' } },
      'If you can see this text, React hydration works correctly.'
    )
  )
}
