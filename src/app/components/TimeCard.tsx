import exp from "constants";
import React from "react";
import { useEffect } from "react";

function TimeCard() {
  const [time, setTime] = React.useState<Date>(new Date());
  const [date, setDate] = React.useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const day = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  }

  return (
    <div className="flex flex-col bg-foreground rounded-lg p-3">
      <div className="flex flex-row gap-3">
        <div className="flex flex-1 flex-row bg-primary rounded-lg p-3 justify-evenly items-center">
          <p>{formatDate(date)}</p>
          <div className="text-headers text-p time">
            {formatTime(time)}
          </div>
          <p>{day(date)}</p>
        </div>
      </div>
    </div>
  );
}

export default TimeCard;
