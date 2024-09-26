import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import eventItems from "../../public/eventItems.json";

interface ReocurringEvent {
  name: string;
  day: string;
  time?: string;
  timeDiffMs?: number;
}

interface SpecialEvent {
  name: string;
  date: string;
  time: string;
  timeDiffMs?: number;
}

interface Place {
  name: string;
  closingHours: Map<string, string>;
}

const reocurringEvents: ReocurringEvent[] = eventItems.reocurring_events;
const specialEvents: SpecialEvent[] = eventItems.special_events;
const places: Place[] = eventItems.places.map((place: any) => ({
  name: place.name,
  closingHours: new Map(place.closing_times.map((time: any) => [time.day, time.time])),
}));

const EventCard: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<
    (ReocurringEvent | SpecialEvent)[]
  >([]);

  useEffect(() => {
    const updateEvents = () => {
      const now = new Date();
      const eventsWithCountdown = reocurringEvents.map((event) => {
        const eventTime = getNextReocurringEvent(event.day, event.time);
        const timeDiffMs = eventTime.getTime() - now.getTime();
        return { ...event, timeDiffMs };
      });

      const filteredEvents = eventsWithCountdown.filter(
        (event) =>
          event.timeDiffMs! > 0 && event.timeDiffMs! <= 48 * 60 * 60 * 1000
      );

      setUpcomingEvents(eventsWithCountdown);
      console.log(eventsWithCountdown);
    };

    updateEvents();
    const intervalId = setInterval(updateEvents, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col bg-foreground rounded-lg p-3">
      <div className="flex flex-col gap-3">
        {upcomingEvents.map((event) => (
          <div className="flex flex-1 flex-row bg-primary rounded-lg p-3 justify-between space">
            <div key={event.name} className="flex flex-row gap-3">
              <p className="event-type">Event</p>
              <p>{event.name}</p>
            </div>
            <div key={event.name} className="flex flex-col gap-3">
              <p>{getTimeDifference(event.timeDiffMs)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getNextReocurringEvent = (day: string, time: string): Date => {
  const daysOfWeek: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const now = new Date();
  const currentDay = now.getDay();
  const targetDay = daysOfWeek[day];

  if (!time) {
    console.error(`Time is undefined for event on ${day}`);
    return now;
  }

  const [eventHour, eventMinute] = time.split(":").map(Number);
  const eventDate = new Date();
  eventDate.setHours(eventHour, eventMinute, 0, 0);

  const daysUntilEvent = (targetDay + 7 - currentDay) % 7;
  eventDate.setDate(eventDate.getDate() + daysUntilEvent);

  if (daysUntilEvent === 0 && now > eventDate) {
    eventDate.setDate(eventDate.getDate() + 7);
  }

  return eventDate;
};

const getTimeDifference = (timeDiff: number): string => {
  const msInHour = 1000 * 60 * 60;
  const msInDay = msInHour * 24;

  if (timeDiff < msInDay) {
    const hoursLeft = Math.floor(timeDiff / msInHour);
    console.log("HOURS LEFT", hoursLeft);
    return `in ${hoursLeft} hours`;
  } else {
    const daysLeft = Math.floor(timeDiff / msInDay);
    console.log("DAYS LEFT", daysLeft);
    return `in ${daysLeft} days`;

  }
};

const getNextSpecialEvent = (date: string, time: string) => {};

export default EventCard;
