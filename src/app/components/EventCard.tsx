import React, { useEffect, useState } from "react";
import eventItems from "../../public/eventItems.json";
import next from "next";

interface RecurringEvent {
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
  timeDiffMs?: number;
}

interface EventCardProps {
  recurringTimeAhead: string;
  specialTimeAhead: string;
  placeTimeAhead: string;
}

const recurringEvents: RecurringEvent[] = eventItems.recurring_events;
const specialEvents: SpecialEvent[] = eventItems.special_events;
const places: Place[] = eventItems.places.map(
  (place: {
    name: string;
    closing_times: { day: string; time: string }[];
  }) => ({
    name: place.name,
    closingHours: new Map(
      place.closing_times.map((time) => [time.day, time.time])
    ),
  })
);

const EventCard: React.FC<EventCardProps> = ({
  recurringTimeAhead,
  specialTimeAhead,
  placeTimeAhead,
}) => {
  const [nextSpecialEvent, setNextSpecialEvent] = useState<
    RecurringEvent | SpecialEvent | Place | null
  >(null);
  const [upcomingEvents, setUpcomingEvents] = useState<
    (RecurringEvent | SpecialEvent | Place)[]
  >([]);

  useEffect(() => {
    const updateEvents = () => {
      const now = new Date();
      // handle recurring events
      const eventsWithCountdown = recurringEvents.map((event) => {
        const eventTime = getNextRecurringEvent(
          event.day,
          event.time || "00:00"
        );
        const timeDiffMs = eventTime.getTime() - now.getTime();
        return { ...event, timeDiffMs };
      });

      // handle places' closing times
      const placesWithCountdown = places.map((place) => {
        const closingTime = getNextClosingTime(place.closingHours);
        const timeDiffMs = closingTime.getTime() - now.getTime();
        return { ...place, timeDiffMs };
      });

      // handle special events
      const specialEventsWithCountdown = specialEvents.map((event) => {
        const [day, month, year] = event.date.split(".");
        const eventTime = new Date(`${year}-${month}-${day}T${event.time}`);
        const timeDiffMs = eventTime.getTime() - now.getTime();
        return { ...event, timeDiffMs };
      });

      const filteredEvents = [
        ...eventsWithCountdown.filter(
          (event) =>
            event.timeDiffMs! > 0 &&
            event.timeDiffMs! <= parseInt(recurringTimeAhead) * 60 * 60 * 1000 // 4 days
        ),
        ...placesWithCountdown.filter(
          (place) =>
            place.timeDiffMs! > 0 &&
            place.timeDiffMs! <= parseInt(placeTimeAhead) * 60 * 60 * 1000 // 4 hours
        ),
      ];

      console.log(specialEventsWithCountdown);

      const nextSpecialEvent = specialEventsWithCountdown.find(
        (event) =>
          event.timeDiffMs! > 0 &&
          event.timeDiffMs! <= parseInt(specialTimeAhead) * 60 * 60 * 1000 // 30 days
      );

      // sort events by time difference
      filteredEvents.sort((a, b) => a.timeDiffMs! - b.timeDiffMs!);

      setUpcomingEvents(filteredEvents);
      setNextSpecialEvent(nextSpecialEvent || null);
    };

    updateEvents();
    const intervalId = setInterval(updateEvents, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [placeTimeAhead, recurringTimeAhead, specialTimeAhead]);

  return (
    <div className="flex flex-col bg-foreground rounded-lg p-3">
      <div className="flex flex-col gap-3">
        {upcomingEvents.map((event) => (
          <div
            className="flex flex-1 flex-row bg-primary rounded-lg p-3 justify-between space"
            key={event.name}
          >
            <div className="flex flex-row gap-3">
              <p className="parabold">
                {"closingHours" in event ? "Closing" : "Event"}
              </p>
              <p className="para">{event.name}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="para">{getTimeDifference(event.timeDiffMs ?? 0)}</p>
            </div>
          </div>
        ))}
        <hr className="border-2 border-primary"></hr>
        {nextSpecialEvent?.name != "" && (
          <div className="flex flex-1 flex-row bg-gradient-to-r from-purple-500 to-overlay rounded-lg p-3 justify-between space border-2 border-primary animate-pulse">
            <div className="flex flex-row gap-3">
              <p className="parabold">Special Event</p>
              <p className="">{nextSpecialEvent?.name}</p>
            </div>
            <div>
              <p className="para">
                {getTimeDifference(nextSpecialEvent?.timeDiffMs ?? 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getNextRecurringEvent = (day: string, time: string): Date => {
  /**
   * Returns the next occurrence of a recurring event.
   *
   * @param {string} day - The day of the week the event occurs on.
   * @param {string} time - The time of day the event occurs at.
   * @returns {Date} The next occurrence of the event.
   *
   */
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

const getNextClosingTime = (closingHours: Map<string, string>): Date => {
  /**
   * Returns the next closing time for a place.
   *
   * @param {Map<string, string>} closingHours - A map of closing times for each day of the week.
   *
   * @returns {Date} The next closing time for the place.
   *
   */
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });

  const closingTime = closingHours.get(currentDay);
  if (!closingTime) {
    return now;
  }

  const [closingHour, closingMinute] = closingTime.split(":").map(Number);
  const closingDate = new Date();
  closingDate.setHours(closingHour, closingMinute, 0, 0);

  if (now > closingDate) {
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000); // add 1 day
    const nextDayName = nextDay.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const nextClosingTime = closingHours.get(nextDayName);
    if (nextClosingTime) {
      const [nextClosingHour, nextClosingMinute] = nextClosingTime
        .split(":")
        .map(Number);
      closingDate.setDate(closingDate.getDate() + 1); // Move to the next day
      closingDate.setHours(nextClosingHour, nextClosingMinute, 0, 0);
    }
  }

  return closingDate;
};

const getTimeDifference = (timeDiff: number): string => {
  /**
   * Returns a human-readable string representing the time difference.
   *
   * @param {number} timeDiff - The time difference in milliseconds.
   *
   * @returns {string} A human-readable string representing the time difference.
   *
   */
  const msInHour = 1000 * 60 * 60;
  const msInDay = msInHour * 24;

  const rtf = new Intl.RelativeTimeFormat("en-US", {
    numeric: "always", // "auto" will show "tomorrow" if day = 1
    style: "long",
  });

  if (timeDiff < msInHour) {
    const minutesLeft = Math.floor(timeDiff / (1000 * 60));
    return rtf.format(minutesLeft, "minute");
  } else if (timeDiff < msInDay) {
    const hoursLeft = Math.floor(timeDiff / msInHour);
    return rtf.format(hoursLeft, "hour");
  } else {
    const daysLeft = Math.floor(timeDiff / msInDay);
    return rtf.format(daysLeft, "day");
  }
};

export default EventCard;
