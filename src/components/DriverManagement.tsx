import React, { useState, useEffect } from 'react'
import { User, Trash2, Plus } from 'lucide-react'
import { Driver, getDrivers, updateDrivers } from '../data'

const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(getDrivers())
  const [newDriver, setNewDriver] = useState<Driver>({ name: '', avatar: '', lapTimes: [] })

  useEffect(() => {
    updateDrivers(drivers)
  }, [drivers])

  const addDriver = () => {
    if (newDriver.name && newDriver.avatar) {
      setDrivers([...drivers, newDriver])
      setNewDriver({ name: '', avatar: '', lapTimes: [] })
    }
  }

  const removeDriver = (index: number) => {
    setDrivers(drivers.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Driver Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
            placeholder="Driver Name"
            className="flex-grow p-2 border rounded"
          />
          <input
            type="text"
            value={newDriver.avatar}
            onChange={(e) => setNewDriver({ ...newDriver, avatar: e.target.value })}
            placeholder="Avatar URL"
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={addDriver}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={!newDriver.name || !newDriver.avatar}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Drivers</h2>
        <ul className="space-y-4">
          {drivers.map((driver, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-4">
                <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full" />
                <span>{driver.name}</span>
              </div>
              <button
                onClick={() => removeDriver(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DriverManagement