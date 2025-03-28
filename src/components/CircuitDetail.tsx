import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, ArrowLeft, Trash2, Edit2, X, Check } from "lucide-react";
import { circuits } from "../data";
import { useEvolu, useQuery } from "@evolu/react";
import { allDrivers, getLapTimesByCircuit, LapTimeId } from "../evoluSetup";
import * as S from "@effect/schema/Schema";
import { cast, NonEmptyString1000 } from "@evolu/common";
import { InputMask } from "@react-input/mask";
import { renderLapTime, convertUrlsToLinks } from "../helpers";

const CircuitDetail: React.FC = () => {
  const { circuitId } = useParams<{ circuitId: string }>();
  const { rows: drivers } = useQuery(allDrivers);
  const circuit = circuits.find(
    (c) => c.name === decodeURIComponent(circuitId || "")
  );
  const { rows: lapTimes } = useQuery(
    getLapTimesByCircuit((circuit?.name ?? "") as NonEmptyString1000)
  );
  const { create, update } = useEvolu();

  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [lapTime, setLapTime] = useState<string>("");
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [lapToDelete, setLapToDelete] = useState<LapTimeId | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(circuit?.description || "");

  const addLapTime = () => {
    if (selectedDriver && lapTime && isValidLapTime(lapTime) && circuit) {
      create("lapTime", {
        driverId: selectedDriver,
        circuit: S.decodeSync(NonEmptyString1000)(circuit.name),
        time: S.decodeSync(NonEmptyString1000)(lapTime),
        timestamp: S.decodeSync(NonEmptyString1000)(new Date().toISOString()),
        isDeleted: cast(false),
      });
      setLapTime("");
    }
  };

  const isValidLapTime = (time: string): boolean => {
    const regex = /^([0-5]?[0-9]):([0-5][0-9])\.([0-9]{3})$/;
    return regex.test(time);
  };

  const openDeleteModal = (lapTimeId: LapTimeId) => {
    setLapToDelete(lapTimeId);
    setShowDeleteModal(true);
  };

  const deleteLapTime = () => {
    if (lapToDelete && deleteReason) {
      update("lapTime", { id: lapToDelete, isDeleted: cast(true) });
      setShowDeleteModal(false);
      setDeleteReason("");
      setLapToDelete(null);
    }
  };

  if (!circuit) {
    return <div>Circuit not found</div>;
  }

  return (
    <div className="relative">
      <Link
        to="/"
        className="inline-flex items-center text-blue-500 hover:underline mb-4"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Circuit List
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {circuit.name}
              {circuit.country !== circuit.name && (
                <span className="text-gray-500 font-normal ml-2">
                  ({circuit.country})
                </span>
              )}
            </h2>
          </div>
          {isEditingDescription ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  circuit.description = description;
                  setIsEditingDescription(false);
                }}
                className="text-green-500 hover:text-green-600"
                title="Save"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setDescription(circuit.description || "");
                  setIsEditingDescription(false);
                }}
                className="text-red-500 hover:text-red-600"
                title="Cancel"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDescription(true)}
              className="text-gray-500 hover:text-gray-600"
              title="Edit Description"
            >
              <Edit2 size={20} />
            </button>
          )}
        </div>
        {isEditingDescription ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Add a description for this circuit..."
          />
        ) : description ? (
          <p className="text-gray-600 whitespace-pre-wrap">
            {convertUrlsToLinks(description)}
          </p>
        ) : (
          <p className="text-gray-400 italic">No description available</p>
        )}
      </div>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add Lap Time</h3>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="flex-grow p-2 border rounded"
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
          <div className="flex flex-grow space-x-4">
            <InputMask
              mask="a:aa.aaa"
              replacement={{ a: /\d/ }}
              value={lapTime}
              onChange={(e) => setLapTime(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={addLapTime}
              disabled={!selectedDriver || !isValidLapTime(lapTime)}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600
                disabled:bg-gray-300 justify-center w-12 h-12 flex items-center justify-center"
            >
              <Clock size={24} />
            </button>
          </div>
        </div>
        {lapTime && !isValidLapTime(lapTime) && (
          <p className="text-red-500 mt-2">
            Invalid lap time format. Use mm:ss.ms (01:23.456)
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Lap Times</h3>
        <ul className="space-y-2">
          {lapTimes.map((lapTime) => (
            <li key={lapTime.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={lapTime.avatar ?? undefined}
                  alt={lapTime.driverName ?? undefined}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{lapTime.driverName}</span>
                <span className="text-sm text-gray-600">
                  {renderLapTime(lapTime.time)}
                </span>
              </div>
              <button
                onClick={() => openDeleteModal(lapTime.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
        {lapTimes.length === 0 && (
          <p className="text-gray-500">No lap times recorded yet.</p>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Delete Lap Time</h3>
            <p className="mb-4">
              Please provide a reason for deleting this lap time:
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={3}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteLapTime}
                disabled={!deleteReason}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircuitDetail;