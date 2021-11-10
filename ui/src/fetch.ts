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

export default function useFetch<M>(
  url: string
): [M, boolean] | [null, boolean] {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    fetchData(url).then((data) => {
      setData(data);
      setFetching(false);
    });
  }, [url]);

  return [data, fetching];
}
