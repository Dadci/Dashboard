// src/utils/toast.js
import toast from 'react-hot-toast'

export const notify = {
  success: (message) => toast.success(message, {
    style: {
      background: '#1e293b',
      color: '#fff',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    }
  }),
  
  error: (message) => toast.error(message, {
    style: {
      background: '#1e293b', 
      color: '#fff',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    }
  }),
}