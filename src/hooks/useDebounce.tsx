import { useEffect, useState } from "react";

const useDebounce = ({ query, debounceTime }: { query: string; debounceTime: number }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceTime);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return debouncedQuery;
};

export default useDebounce;
