import { useState, useEffect } from "react";

async function fetchData(url: string) {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      return await response.json();
    } catch {
      throw new Error("Could parse response as JSON");
    }
}

export default function useFetch<M>(url: string): M[] | null {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(url).then((data) => {
      setData(data)
    })
  }, [url]);

  return data;
}
