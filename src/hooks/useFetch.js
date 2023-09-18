import { useEffect, useState } from 'react';

const BASE_URL = `http://www.omdbapi.com/?apikey=64ddb543`;

export const useFetch = (query) => {
  const [thingsToFetch, setThingsToFetch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchThings = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(`${BASE_URL}&s=${query}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error('Something went wrong...');
        } // if there was an error, ( ex failed to fetch) here the code below wouldn't get executed
        // so isLoading would never get set back to false --> put it in finally block

        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(`${data.Error}`); // // depending on API endpoint
        }
        setThingsToFetch(data.Search); // depending on API endpoint
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!query.length || query.length < 3) {
      setThingsToFetch([]);
      setError('Start searching... (min 3 characters)');
      return;
    }
    //   handleCloseMovieDetails(); // callback argument
    fetchThings();

    // clean up
    return function () {
      controller.abort();
    };
  }, [query]);

  return { thingsToFetch, isLoading, error };
};
