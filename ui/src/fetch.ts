import { useEffect, useState } from "react";

async function fetchData(url: string, method = "GET", data: any = null) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch (e) {
    throw new Error("Could not fetch");
  }
  try {
    return await response.json();
  } catch {
    throw new Error("Could parse response as JSON");
  }
}

/**
 * Get data from URL on mount.
 *
 * @param url
 */
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

export async function put(url: string, data: any) {
  return await fetchData(url, "PUT", data);
}
