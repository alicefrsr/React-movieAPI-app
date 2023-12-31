import { useState, useEffect } from 'react';
// import { tempMovieData, tempWatchedData } from './assets/data/tempData';
import Navbar from './components/Navbar';
import Search from './components/Search';
import NumResults from './components/NumResults';
import Box from './components/Box';
import Main from './components/Main';
import MoviesList from './components/MoviesList';
import MovieDetails from './components/MovieDetails';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

import './App.css';
import { useMovies } from './hooks/useMovies';
import { useLocalStorageState } from './hooks/useLocalStorageState';

// moved to custom hook useMovies
// const BASE_URL = `http://www.omdbapi.com/?apikey=64ddb543`;

function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // moved to custom hook useMovies():
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');
  const { movies, isLoading, error } = useMovies(query);

  // const [watched, setWatched] = useState(tempWatchedData);
  // const [watched, setWatched] = useState([]);

  // moved to useLocalStorage hook
  // fetching from localStorage on first render
  // const storedValues = () => JSON.parse(localStorage.getItem('watched')) || [];
  // const [watched, setWatched] = useState(storedValues);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const handleSelectMovie = id => {
    // setSelectedId(id);
    // to close the movie details box when clicking on same movie again
    setSelectedId(selectedId => (id === selectedId ? null : id));
  };

  // function declaration so can be hoisted and passed in the useMovies() hook
  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  const handleAddWatched = movie => {
    setWatched(watched => [...watched, movie]);
    // localStorage option 1
    // can't do this because 'watched' array hasn't yet been updated (stale state)
    // localStorage.setItem('watched', watched);
    // correct way
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  };

  const handleDeleteWatched = id => {
    const updatedWatchedList = watched.filter(watched => watched.imdbID !== id);
    setWatched(updatedWatchedList);
  };

  // localStorage option 2
  // moved to useLocalStorage hook
  // useEffect(() => {
  //   localStorage.setItem('watched', JSON.stringify(watched));
  // }, [watched]);

  // moved to custom hook useMovies
  // useEffect(
  //   function () {
  //     // to clean up to prevent too many unecessary requests
  //     // create an abortController (browser API), set signal to controller.signal in {options},  return controller.abort at the end and ignore the error (also setError to '')
  //     const controller = new AbortController();

  //     const fetchMovies = async () => {
  //       try {
  //         setIsLoading(true);
  //         setError('');
  //         const res = await fetch(`${BASE_URL}&s=${query}`, { signal: controller.signal });
  //         // const res = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${query}`);

  //         if (!res.ok) {
  //           throw new Error('Something went wrong...');
  //         } // if there was an error, ( ex failed to fetch) here the code below wouldn't get executed
  //         // so isLoading would never get set back to false --> put it in finally block

  //         const data = await res.json();
  //         if (data.Response === 'False') {
  //           throw new Error(`${data.Error}`); // returns the API data.Error value: "Movie not found" OR:
  //           // throw new Error('Customised error message that says movie not in API...');
  //         }
  //         setMovies(data.Search);
  //         // setIsLoading(false); // in finally block
  //         setError('');
  //       } catch (error) {
  //         if (error.name !== 'AbortError') setError(error.message);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     if (!query.length || query.length < 3) {
  //       setMovies([]);
  //       setError('Start searching... (min 3 characters)');
  //       return;
  //     }
  //     handleCloseMovieDetails();
  //     fetchMovies();

  //     // clean up
  //     return function () {
  //       controller.abort();
  //     };
  //   },
  //   [query]
  // );

  return (
    <div className='app'>
      <Navbar>
        <Search
          query={query}
          setQuery={setQuery}
          onCloseDetails={handleCloseMovieDetails}
        />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* ugly code? */}
          {/* {isLoading ? <Loading /> : error ? <ErrorMessage message={error} /> : <MoviesList movies={movies} />}</Box> */}
          {/* better? this only works because 3 mutually exclusive conditions: */}
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MoviesList
              movies={movies}
              onSelectMovie={handleSelectMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseDetails={handleCloseMovieDetails}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

export default App;
