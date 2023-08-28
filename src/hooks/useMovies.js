import { useEffect, useState } from 'react';

const BASE_URL = `http://www.omdbapi.com/?apikey=64ddb543`;

export const useMovies = query => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // will call handleCloseMovieDetails() (for example) only if (?) we pass it in
    // callback?.(); // infinite loop when callback added in dependency array

    // to clean up to prevent too many unecessary requests
    // create an abortController (browser API), set signal to controller.signal in {options},  return controller.abort at the end and ignore the error (also setError to '')
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(`${BASE_URL}&s=${query}`, { signal: controller.signal });

        if (!res.ok) {
          throw new Error('Something went wrong...');
        } // if there was an error, ( ex failed to fetch) here the code below wouldn't get executed
        // so isLoading would never get set back to false --> put it in finally block

        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(`${data.Error}`); // returns the API data.Error value: "Movie not found" OR:
          // throw new Error('Customised error message that says movie not in API...');
        }
        setMovies(data.Search);
        // setIsLoading(false); // in finally block
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!query.length || query.length < 3) {
      setMovies([]);
      setError('Start searching... (min 3 characters)');
      return;
    }
    //   handleCloseMovieDetails(); // callback argument
    fetchMovies();

    // clean up
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
};
