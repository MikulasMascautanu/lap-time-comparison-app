import React from "react";
import { Link } from "react-router-dom";
import { circuits } from "../data";
import { useQuery } from "@evolu/react";
import { getTop3DriversByLapTime } from "../evoluSetup";
import { NonEmptyString1000 } from "@evolu/common";
import { renderLapTime } from "../helpers";
import { calculateTimeDifference } from "../helpers";

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

const CircuitCard: React.FC<{ circuit: { name: string; country: string; description?: string } }> = ({
  circuit,
}) => {
  const { rows: top3Drivers } = useQuery(
    getTop3DriversByLapTime(circuit.name as NonEmptyString1000)
  );

  return (
    <Link
      to={`/circuit/${encodeURIComponent(circuit.name)}`}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-4">
        {circuit.name}
        {circuit.country !== circuit.name && (
          <span className="text-gray-500 font-normal"> ({circuit.country})</span>
        )}
      </h2>
      <h3 className="font-semibold mb-2">Top 3 Drivers:</h3>
      {top3Drivers.length ? (
        <div className="flex flex-col space-y-1">
          {top3Drivers.map(
            (driver, index) =>
              driver && (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                      index === 0
                        ? "border-yellow-400"
                        : index === 1
                        ? "border-gray-400"
                        : index === 2
                        ? "border-yellow-800"
                        : ""
                    }`}
                  >
                    <img
                      src={driver.avatar ?? undefined}
                      alt={driver.driverName ?? undefined}
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <span className="text-sm">
                    {driver.driverName}: {renderLapTime(driver.bestLapTime)}
                    {index > 0 && top3Drivers[0] && (
                      <span className="text-gray-500 ml-1">
                        ({calculateTimeDifference(
                          top3Drivers[0].bestLapTime!,
                          driver.bestLapTime!
                        )})
                      </span>
                    )}
                  </span>
                </div>
              )
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No lap times recorded yet</p>
      )}
    </Link>
  );
};

export default CircuitList;
