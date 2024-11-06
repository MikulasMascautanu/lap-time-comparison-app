import React, { useState } from "react";
import { Trash2, Plus, RefreshCw } from "lucide-react";
import * as S from "@effect/schema/Schema";
import { cast, NonEmptyString1000 } from "@evolu/common";
import { useEvolu, useQuery } from "@evolu/react";
import { allDrivers, DriverId } from "../evoluSetup";

const DriverManagement: React.FC = () => {
  const { rows: drivers } = useQuery(allDrivers);
  const { create, update } = useEvolu();
  const [newDriver, setNewDriver] = useState({
    name: "",
    avatar: getRandomUnsplashUrl(),
  });

  const addDriver = () => {
    if (newDriver.name && newDriver.avatar) {
      create("driver", {
        name: S.decodeSync(NonEmptyString1000)(newDriver.name),
        avatar: S.decodeSync(NonEmptyString1000)(newDriver.avatar),
        isDeleted: cast(false),
      });
      setNewDriver({ name: "", avatar: getRandomUnsplashUrl() });
    }
  };

  const removeDriver = (id: DriverId) => {
    update("driver", { id, isDeleted: cast(true) });
  };

  const refreshAvatar = () => {
    setNewDriver({ ...newDriver, avatar: getRandomUnsplashUrl() });
  };

  function getRandomUnsplashUrl() {
    return `https://picsum.photos/seed/${Math.floor(
      Math.random() * 1000000
    )}/200/200`;
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
            onChange={(e) =>
              setNewDriver({ ...newDriver, name: e.target.value })
            }
            placeholder="Driver Name"
            className="flex-grow p-2 border rounded"
          />
          <div className="flex-grow relative">
            <input
              type="text"
              value={newDriver.avatar}
              onChange={(e) =>
                setNewDriver({ ...newDriver, avatar: e.target.value })
              }
              placeholder="Avatar URL"
              className="w-full p-2 border rounded pr-10"
            />
            <button
              onClick={refreshAvatar}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Refresh Avatar"
            >
              <RefreshCw size={20} />
            </button>
          </div>
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
          {drivers.map((driver) => (
            <li
              key={driver.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={driver.avatar ?? undefined}
                  alt={driver.name ?? undefined}
                  className="w-10 h-10 rounded-full"
                />
                <span>{driver.name}</span>
              </div>
              <button
                onClick={() => removeDriver(driver.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DriverManagement;
