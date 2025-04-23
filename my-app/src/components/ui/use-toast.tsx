'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

interface ToastState extends ToastProps {
  id: string
  visible: boolean
}

// Simple toast implementation
const toastState: {
  toasts: ToastState[]
  add: (toast: ToastProps) => void
  remove: (id: string) => void
} = {
  toasts: [],
  add: () => {},
  remove: () => {},
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  useEffect(() => {
    toastState.add = (toast: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts(prev => [...prev, { ...toast, id, visible: true }])
      
      // Auto dismiss
      setTimeout(() => {
        toastState.remove(id)
      }, toast.duration || 3000)
    }
    
    toastState.remove = (id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex items-start gap-3 max-w-sm animate-in slide-in-from-right-5 ${
            toast.variant === 'destructive' ? 'bg-red-50 border border-red-200' : 'bg-white border'
          }`}
        >
          <div className="flex-1">
            <h3 className={`font-medium ${toast.variant === 'destructive' ? 'text-red-800' : ''}`}>
              {toast.title}
            </h3>
            {toast.description && (
              <p className={`text-sm mt-1 ${toast.variant === 'destructive' ? 'text-red-700' : 'text-gray-500'}`}>
                {toast.description}
              </p>
            )}
          </div>
          <button 
            onClick={() => toastState.remove(toast.id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function toast(props: ToastProps) {
  toastState.add(props)
} 