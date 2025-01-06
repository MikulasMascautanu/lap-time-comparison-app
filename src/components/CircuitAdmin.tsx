import React, { useState } from "react";
import { useQuery, useEvolu } from "@evolu/react";
import { circuits } from "../data";
import { getLapTimesByCircuit, LapTimeId } from "../evoluSetup";
import { NonEmptyString1000 } from "@evolu/common";
import * as S from "@effect/schema/Schema";
import { renderLapTime } from "../helpers";

const CircuitAdmin: React.FC = () => {
  const { update } = useEvolu();
  const [editingLapTime, setEditingLapTime] = useState<string | null>(null);
  const [newLapTime, setNewLapTime] = useState<string>("");

  const handleEdit = (lapTimeId: string, currentLapTime: string) => {
    setEditingLapTime(lapTimeId);
    setNewLapTime(currentLapTime);
  };

  const handleSave = (lapTimeId: LapTimeId) => {
    if (isValidLapTime(newLapTime)) {
      update("lapTime", {
        id: lapTimeId,
        time: S.decodeSync(NonEmptyString1000)(newLapTime),
      });
      setEditingLapTime(null);
      setNewLapTime("");
    }
  };

  const isValidLapTime = (time: string): boolean => {
    const regex = /^([0-5]?[0-9]):([0-5][0-9])\.([0-9]{3})$/;
    return regex.test(time);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Circuit Admin Management</h1>
      {circuits.map((circuit) => {
        const { rows: lapTimes } = useQuery(
          getLapTimesByCircuit(circuit.name as NonEmptyString1000)
        );

        return (
          <div key={circuit.name} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{circuit.name}</h2>
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Driver Name</th>
                  <th className="py-2 px-4 border-b">Lap Time</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lapTimes.map((lapTime) => (
                  <tr key={lapTime.id}>
                    <td className="py-2 px-4 border-b">{lapTime.driverName}</td>
                    <td className="py-2 px-4 border-b">
                      {editingLapTime === lapTime.id ? (
                        <input
                          type="text"
                          value={newLapTime}
                          onChange={(e) => setNewLapTime(e.target.value)}
                          className="p-2 border rounded"
                        />
                      ) : (
                        renderLapTime(lapTime.time)
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {editingLapTime === lapTime.id ? (
                        <button
                          onClick={() => handleSave(lapTime.id)}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(lapTime.id, lapTime.time)}
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default CircuitAdmin;
