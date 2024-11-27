import React from "react";
import { useEffect } from "react";

function TimeCard() {
  const [time, setTime] = React.useState<Date>(new Date());
  const [date] = React.useState<Date>(new Date());

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
    const day = convertToDayWithEnding(date);
    const monthText = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // This is technically the british way of writing things but of well
    // If we're going to argue about the order we might as well drop the st, nd, rd, th suffixes.
    return `${day} of ${monthText} ${year}`;
  };

  const day = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const convertToDayWithEnding = (date: Date) => {
    const day = date.getDate();

    const enOrdinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });
    const suffixes = new Map([
      ["one", "st"],
      ["two", "nd"],
      ["few", "rd"],
      ["other", "th"],
    ]);

    const rule = enOrdinalRules.select(day);
    const suffix = suffixes.get(rule);
    return `${day}${suffix}`;
  };

  return (
    <div className="flex flex-col bg-foreground rounded-lg p-3">
      <div className="flex flex-row gap-3">
        <div className="flex flex-1 flex-row bg-primary rounded-lg p-5 pl-3 pr-3 justify-between items-center">
          <p className="text-p para">{formatDate(date)}</p>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-headers text-p time">{formatTime(time)}</div>
          <p className="text-p para">{day(date)}</p>
        </div>
      </div>
    </div>
  );
}

export default TimeCard;
