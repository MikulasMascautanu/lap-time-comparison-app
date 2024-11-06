import React from "react";
import { Link } from "react-router-dom";
import { circuits } from "../data";
import { useQuery } from "@evolu/react";
import { getBestLapTimeByCircuit } from "../evoluSetup";
import { NonEmptyString1000 } from "@evolu/common";

const CircuitList: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">F1 Circuits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circuits.map((circuit, index) => (
          <CircuitCard key={index} circuit={circuit} />
        ))}
      </div>
    </div>
  );
};

const CircuitCard: React.FC<{ circuit: { name: string; country: string } }> = ({
  circuit,
}) => {
  const { rows: bestLapTimes } = useQuery(
    getBestLapTimeByCircuit(circuit.name as NonEmptyString1000)
  );
  const bestLapTime = bestLapTimes[0];

  return (
    <Link
      to={`/circuit/${encodeURIComponent(circuit.name)}`}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-4">{circuit.name}</h2>
      <p className="text-gray-600 mb-4">{circuit.country}</p>
      <h3 className="font-semibold mb-2">Best Lap Time:</h3>
      {bestLapTime ? (
        <div className="flex items-center space-x-2">
          <img
            src={bestLapTime.avatar ?? undefined}
            alt={bestLapTime.driverName ?? undefined}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm">
            {bestLapTime.driverName}: {bestLapTime.time}
          </span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No lap times recorded yet</p>
      )}
    </Link>
  );
};

export default CircuitList;
