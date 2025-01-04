import { NonEmptyString1000, cast, database, id, table } from "@evolu/common";
import { createEvolu } from "@evolu/react";

const DriverId = id("Driver");
export type DriverId = typeof DriverId.Type;

const LapTimeId = id("LapTime");
export type LapTimeId = typeof LapTimeId.Type;

const DriverTable = table({
  id: DriverId,
  name: NonEmptyString1000,
  avatar: NonEmptyString1000,
});
type DriverTable = typeof DriverTable.Type;

const LapTimeTable = table({
  id: LapTimeId,
  driverId: DriverId,
  circuit: NonEmptyString1000,
  time: NonEmptyString1000,
  timestamp: NonEmptyString1000,
});
type LapTimeTable = typeof LapTimeTable.Type;

const Database = database({
  driver: DriverTable,
  lapTime: LapTimeTable,
});
type Database = typeof Database.Type;

export const evolu = createEvolu(Database);

export const allDrivers = evolu.createQuery((db) =>
  db
    .selectFrom("driver")
    .selectAll()
    .where("isDeleted", "is not", cast(true))
    .orderBy("createdAt")
);

export const getLapTimesByCircuit = (circuitName: NonEmptyString1000) =>
  evolu.createQuery((db) =>
    db
      .selectFrom("lapTime")
      .innerJoin("driver", "driver.id", "lapTime.driverId")
      .select([
        "lapTime.id",
        "lapTime.time",
        "lapTime.timestamp",
        "driver.name as driverName",
        "driver.avatar",
      ])
      .where("lapTime.circuit", "=", circuitName)
      .where("lapTime.isDeleted", "is not", cast(true))
      .orderBy("lapTime.timestamp", "desc")
  );

/**
 * @deprecated
 */
export const getBestLapTimeByCircuit = (circuitName: NonEmptyString1000) =>
  evolu.createQuery((db) =>
    db
      .selectFrom("lapTime")
      .innerJoin("driver", "driver.id", "lapTime.driverId")
      .select([
        "lapTime.id",
        "lapTime.time",
        "lapTime.timestamp",
        "driver.name as driverName",
        "driver.avatar",
      ])
      .where("lapTime.circuit", "=", circuitName)
      .where("lapTime.isDeleted", "is not", cast(true))
      .orderBy("lapTime.time", "asc")
      .limit(1)
  );

  export const getTop3DriversByLapTime = (circuitName: NonEmptyString1000) =>
    evolu.createQuery((db) =>
      db
        .selectFrom("lapTime")
        .innerJoin("driver", "driver.id", "lapTime.driverId")
        .select([
          "driver.id as driverId",
          "driver.name as driverName",
          "driver.avatar",
          db.fn.min("lapTime.time").as("bestLapTime"),
        ])
        .where("lapTime.circuit", "=", circuitName)
        .where("lapTime.isDeleted", "is not", cast(true))
        .groupBy("driver.id") // Group by driver
        .orderBy("bestLapTime", "asc")
        .limit(3) // Get only the top 3 drivers
    );
