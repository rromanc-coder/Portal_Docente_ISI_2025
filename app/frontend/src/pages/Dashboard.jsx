import React, { useEffect, useState } from 'react'
import client from '../api/client'
import ContainerCard from '../components/ContainerCard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard(){
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState(null)

  const fetchAll = async () => {
    const [c, m] = await Promise.all([
      client.get('/containers'),
      client.get('/metrics')
    ])
    setItems(c.data)
    setStats(m.data)
  }

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, 5000)
    return () => clearInterval(id)
  }, [])

  const restart = async (name) => {
    await client.post(`/containers/restart/${name}`)
    fetchAll()
  }

  const showLogs = async (name) => {
    const res = await client.get(`/containers/logs/${name}?lines=80`)
    setLogs(res.data)
  }

  const COLORS = ['#10B981','#F59E0B','#EF4444','#6B7280']

  const data = stats ? [
    {name:'running', value: (stats.counts_by_status.running || 0)},
    {name:'restarting', value: (stats.counts_by_status.restarting || 0)},
    {name:'exited', value: (stats.counts_by_status.exited || 0)},
    {name:'other', value: stats.total - ((stats.counts_by_status.running||0)+(stats.counts_by_status.restarting||0)+(stats.counts_by_status.exited||0))},
  ] : []

  return (
    <div className='grid gap-6'>
      <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white rounded-xl shadow p-4'>
          <h2 className='font-semibold mb-2'>Estado general</h2>
          <div className='h-48'>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey='value' nameKey='name' outerRadius={80} label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981','#F59E0B','#EF4444','#6B7280'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-4 md:col-span-2'>
          <h2 className='font-semibold mb-2'>Contenedores</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'>
            {items.map((c) => (
              <ContainerCard key={c.name} c={c} onRestart={restart} onShowLogs={showLogs}/>
            ))}
          </div>
        </div>
      </section>

      {logs && (
        <section className='bg-white rounded-xl shadow p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold'>Logs: {logs.name}</h2>
            <button className='text-sm text-blue-600' onClick={() => setLogs(null)}>Cerrar</button>
          </div>
          <pre className='text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96'>{logs.logs}</pre>
        </section>
      )}
    </div>
  )
}
