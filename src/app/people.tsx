import React, { useEffect, useState } from "react";

const SanityPeople = () => {
  const [people, setPeople] = useState([]);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  useEffect(() => {
    const fetchData = async () => {
      const query = encodeURIComponent('*[_type == "author"]');
      const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setPeople(data.result);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId, dataset]);

  return people;
}

export default SanityPeople;