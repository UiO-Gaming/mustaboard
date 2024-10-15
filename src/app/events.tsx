import { useEffect, useState } from "react";

const SanityEvents = () => {
  const [events, setEvents] = useState([]);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  useEffect(() => {
    const fetchData = async () => {
      const query = encodeURIComponent('*[_type == "event"]');
      const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setEvents(data.result);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId, dataset]);

  return events;
}

export default SanityEvents;