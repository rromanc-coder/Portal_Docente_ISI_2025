import React from 'react'
import { Monitor } from 'lucide-react'
export default function Header(){
  return (
    <header className='bg-white shadow'>
      <div className='container mx-auto p-4 flex items-center gap-3'>
        <Monitor />
        <h1 className='text-xl font-bold'>Portal Docente ISI 2025</h1>
      </div>
    </header>
  )
}
