import { useState, useEffect, useRef } from 'react';

import Loading from './Loading';
import ReusableStarRating from './ReusableStarRating';
import { useKey } from '../hooks/useKey';

const BASE_URL = `https://www.omdbapi.com/?apikey=64ddb543`;

const MovieDetails = ({
  selectedId,
  onCloseDetails,
  onAddWatched,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  // we only want to add a movie to the WatchedMoviesList once
  // derived state to check if movie is already in WatchedMoviesList: transform watched array of objects into array of ids so we can check movie id against ids already there:
  const alreadyWatched = watched
    .map((watchedIds) => watchedIds.imdbID)
    .includes(movie.imdbID);
  // const alreadyWatched = watched.map(watchedIds => watchedIds.imdbID).includes(selectedId);
  // console.log('alreadyWatched ', alreadyWatched); // true or false

  // get the userRating value : find the movie in the array that matches selectedId, take the userRating prop only if this array is not empty (undefined) (with ?optional chaining)
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  // console.log('watchedUserRating', watchedUserRating);

  // destructuring to rename props from API
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    Year: year,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    // we are CREATING a brand new object, NOT selecting an existing one in the movie list using its ID
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseDetails();
    // console.log(newWatchedMovie.userRating);
  };

  // adding a keydown event to close the moviesDetails screen instead of clicking back btn
  // --> an event listener will be added/attached to the document EACH TIME a movieDetails component is rendered. They will keep accumulating without a CLEAN UP
  useKey('Escape', onCloseDetails);

  // moved to useKey()
  // useEffect(() => {
  //   const callback = e => {
  //     if (e.code === 'Escape') {
  //       onCloseDetails();
  //     }
  //   };
  //   document.addEventListener('keydown', callback);
  //   // clean up
  //   return function () {
  //     document.removeEventListener('keydown', callback);
  //   };
  // }, [onCloseDetails]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    };
    fetchMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    // clean up
    return () => (document.title = 'usePopcorn | Home');
  }, [title]);

  return (
    <div className='details'>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className='btnBack' onClick={onCloseDetails}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className='detailsOverview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating}
              </p>
            </div>
          </header>

          <section>
            <div className='rating'>
              {!alreadyWatched ? (
                <>
                  <ReusableStarRating
                    maxRating={10}
                    ratingColor={'#fcc419'}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 ? (
                    <button className='btn-add' onClick={handleAdd}>
                      Add to List
                    </button>
                  ) : (
                    <p>Rate this movie to add it to your list!</p>
                  )}{' '}
                </>
              ) : (
                <p>
                  You rated this movie:{' '}
                  <span className='userRating'>⭐️ {watchedUserRating} </span>/
                  10
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};
export default MovieDetails;
