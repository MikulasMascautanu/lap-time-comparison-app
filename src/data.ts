export interface Circuit {
  name: string;
  country: string;
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
  { name: "Bahrain International Circuit", country: "Bahrain" },
  { name: "Jeddah Corniche Circuit", country: "Saudi Arabia" },
  { name: "Albert Park Circuit", country: "Australia" },
  { name: "Suzuka International Racing Course", country: "Japan" },
  { name: "Shanghai International Circuit", country: "China" },
  { name: "Miami International Autodrome", country: "USA" },
  { name: "Autodromo Enzo e Dino Ferrari", country: "Italy" },
  { name: "Circuit de Monaco", country: "Monaco" },
  { name: "Circuit Gilles-Villeneuve", country: "Canada" },
  { name: "Circuit de Barcelona-Catalunya", country: "Spain" },
  { name: "Red Bull Ring", country: "Austria" },
  { name: "Silverstone Circuit", country: "Great Britain" },
  { name: "Hungaroring", country: "Hungary" },
  { name: "Circuit de Spa-Francorchamps", country: "Belgium" },
  { name: "Circuit Zandvoort", country: "Netherlands" },
  { name: "Autodromo Nazionale Monza", country: "Italy" },
  { name: "Baku City Circuit", country: "Azerbaijan" },
  { name: "Marina Bay Street Circuit", country: "Singapore" },
  { name: "Circuit of The Americas", country: "USA" },
  { name: "Autódromo Hermanos Rodríguez", country: "Mexico" },
  { name: "Autódromo José Carlos Pace", country: "Brazil" },
  { name: "Las Vegas Strip Circuit", country: "USA" },
  { name: "Losail International Circuit", country: "Qatar" },
  { name: "Yas Marina Circuit", country: "Abu Dhabi" },
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
