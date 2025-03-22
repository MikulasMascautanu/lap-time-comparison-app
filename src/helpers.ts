import React from 'react';

/**
 * Removes leading zeros from lap time
 * @param lapTime 
 */
export const renderLapTime = (lapTime: string | null) => {
  const formattedLapTime = lapTime?.replace(/^0+/, "");
  return formattedLapTime || "0:00.000";
};

export const calculateTimeDifference = (fasterTime: string, slowerTime: string): string => {
  const timeToMs = (timeStr: string): number => {
    const [minutes, rest] = timeStr.split(':');
    const [seconds, milliseconds] = rest.split('.');
    return (
      parseInt(minutes) * 60000 +
      parseInt(seconds) * 1000 +
      parseInt(milliseconds)
    );
  };

  const diff = timeToMs(slowerTime) - timeToMs(fasterTime);
  return `+${(diff / 1000).toFixed(3)}`;
};

export const convertUrlsToLinks = (text: string): React.ReactNode[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return React.createElement('a', {
        key: index,
        href: part,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-600 hover:text-blue-800 hover:underline'
      }, part);
    }
    return part;
  });
};