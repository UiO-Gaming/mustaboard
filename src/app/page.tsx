"use client";

import next from "next";
import MenuCard from "./components/MenuCard";
import TemperatureCard from "./components/TemperatureCard";
import TimeCard from "./components/TimeCard";
import EventCard from "./components/EventCard";
import { useEffect, useState } from "react";

interface WeatherData {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };

  properties: {
    meta: {
      updated_at: string;
      units: Record<string, string>;
    };
    timeseries: Array<{
      time: string;
      data: {
        instant: {
          details: {
            air_temperature: number;
            wind_speed: number;
            precipitation_amount: number;
          };
        };
      };
    }>;
  };
}

interface Forecast {
  time: string;
  temperature: number;
}

interface Wind {
  speed: number;
  gust: number;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [nearestHour, setnearestHour] = useState<string | null>(null);
  const [nextThreeHours, setNextThreeHours] = useState<Forecast[]>([]);
  const [currentWind, setCurrentWind] = useState<Wind | null>(null);
  const [currentPrecipitation, setCurrentPrecipitation] = useState<
    number | null
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          // Majorstuen, Oslo, 48m above sea level
          "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=59.93&lon=10.71&altitude=48"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setWeatherData(data);

        // find the nearest timestamp to the current time
        if (data && data.properties && data.properties.timeseries) {
          const currentTime = new Date();
          const timeseries = data.properties.timeseries;

          const nearest = data.properties.timeseries.reduce((prev: { time: string }, curr: { time: string }) => {
            const prevTime = new Date(prev.time);
            const currTime = new Date(curr.time);
            return Math.abs(currTime.getTime() - currentTime.getTime()) <
              Math.abs(prevTime.getTime() - currentTime.getTime())
              ? curr
              : prev;
          });

          setnearestHour(nearest.time);

          // find the next five hours
          const nearestIndex = timeseries.findIndex(
            (t: { time: number }) => t.time === nearest.time
          );

          const nextFive = timeseries
            .slice(nearestIndex + 1, nearestIndex + 4)
            .map(
              (ts: {
                time: number;
                data: { instant: { details: { air_temperature: any } } };
              }) => {
                const date = new Date(ts.time);
                const hour = date.getHours().toString().padStart(2, "0");
                const temperature = ts.data.instant.details.air_temperature;
                return { time: hour, temperature: Math.round(temperature) };
              }
            );

          setNextThreeHours(nextFive);
          setCurrentPrecipitation(
            nearest.data.next_1_hours.details.precipitation_amount
          );
          setCurrentWind({
            speed: Math.round(nearest.data.instant.details.wind_speed),
            gust: Math.round(nearest.data.instant.details.wind_speed_of_gust),
          });
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // flex direction vertical
    <div className="w-screen h-screen bg-background flex flex-col p-3 gap-3">
      <MenuCard></MenuCard>
      <TemperatureCard
        temperature={Math.round(
          Number(
            weatherData.properties.timeseries.find(
              (t) => t.time === nearestHour
            )?.data.instant.details.air_temperature
          )
        )}
        precipitation={currentPrecipitation ?? 0}
        wind={currentWind}
        fiveHourForecast={nextThreeHours}
      />
      <EventCard></EventCard>
      <TimeCard></TimeCard>

      <div className="flex-1 bg-green-500"></div>
    </div>
  );
}
