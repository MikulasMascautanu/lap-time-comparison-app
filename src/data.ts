export interface Circuit {
  name: string;
  country: string;
  description?: string;
}

export interface LapTime {
  circuit: string;
  time: string;
}

export interface Driver {
  name: string;
  avatar: string;
  lapTimes: LapTime[];
}

export const circuits: Circuit[] = [
  { name: "Australia", country: "Australia" },
  { name: "Shanghai", country: "China" },
  { name: "Suzuka", country: "Japan" },
  { name: "Bahrain", country: "Bahrain" },
  { name: "Jeddah", country: "Saudi Arabia" },
  { name: "Miami", country: "USA" },
  { name: "Emilia-Romagna", country: "Italy" },
  { name: "Monaco", country: "Monaco" },
  { name: "Spain", country: "Spain" },
  { name: "Canada", country: "Canada" },
  { name: "Red Bull Ring", country: "Austria" },
  { name: "Silverstone", country: "Great Britain" },
  { name: "Spa", country: "Belgium" },
  { name: "Hungaroring", country: "Hungary" },
  { name: "Zandvoort", country: "Netherlands" },
  { name: "Monza", country: "Italy" },
  { name: "Baku", country: "Azerbaijan" },
  { name: "Singapore", country: "Singapore" },
  { name: "United States", country: "USA" },
  { name: "Mexico", country: "Mexico" },
  { name: "Brazil", country: "Brazil" },
  { name: "Las Vegas", country: "USA" },
  { name: "Qatar", country: "Qatar" },
  { name: "Abu Dhabi", country: "Abu Dhabi" },
];

export const getDrivers = (): Driver[] => {
  const savedDrivers = localStorage.getItem("f1LapTimeDrivers");
  return savedDrivers ? JSON.parse(savedDrivers) : [];
};

export const updateDrivers = (drivers: Driver[]) => {
  localStorage.setItem("f1LapTimeDrivers", JSON.stringify(drivers));
};

export const updateDriver = (updatedDriver: Driver) => {
  const drivers = getDrivers();
  const index = drivers.findIndex((d) => d.name === updatedDriver.name);
  if (index !== -1) {
    drivers[index] = updatedDriver;
    updateDrivers(drivers);
  }
};

/**
 * @deprecated
 */
export const getBestLapTime = (circuitName: string) => {
  const drivers = getDrivers();
  const allLapTimes = drivers.flatMap((driver) =>
    driver.lapTimes
      .filter((lapTime) => lapTime.circuit === circuitName)
      .map((lapTime) => ({
        ...lapTime,
        driverName: driver.name,
        avatar: driver.avatar,
      }))
  );

  return allLapTimes.length > 0
    ? allLapTimes.reduce((best, current) =>
      current.time < best.time ? current : best
    )
    : null;
};
