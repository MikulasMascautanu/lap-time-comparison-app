/**
 * Removes leading zeros from lap time
 * @param lapTime 
 */
export const renderLapTime = (lapTime: string | null) => {
  const formattedLapTime = lapTime?.replace(/^0+/, "");
  return formattedLapTime || "0:00.000";
};
