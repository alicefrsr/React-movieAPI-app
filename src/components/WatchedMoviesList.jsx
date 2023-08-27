import WatchedMovie from './WatchedMovie';

const WatchedMoviesList = ({ watched, onDeleteWatched }) => {
  return (
    <ul className='list'>
      {watched.map(movie => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
};

export default WatchedMoviesList;
