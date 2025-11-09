import React from 'react'
import { RefreshCw, FileText, Circle } from 'lucide-react'

export default function ContainerCard({ c, onRestart, onShowLogs }){
  const color = c.status === 'running' ? 'text-green-500' : c.status === 'restarting' ? 'text-yellow-500' : 'text-red-500'
  return (
    <div className='bg-white rounded-xl shadow p-4 flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Circle className={color} />
          <h3 className='font-semibold'>{c.name}</h3>
        </div>
        <span className='text-xs bg-gray-100 px-2 py-1 rounded'>{c.status}</span>
      </div>
      <div className='text-xs text-gray-500 truncate'>Image: {c.image}</div>
      <div className='flex gap-2 pt-2'>
        <button onClick={() => onShowLogs(c.name)} className='px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-1'>
          <FileText size={16}/> Logs
        </button>
        <button onClick={() => onRestart(c.name)} className='px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1'>
          <RefreshCw size={16}/> Restart
        </button>
      </div>
    </div>
  )
}
