import Movie from './Movie';

const MoviesList = ({ movies, onSelectMovie }) => {
  return (
    <ul className='list listMovies'>
      {movies?.map(movie => (
        <Movie
          onSelectMovie={onSelectMovie}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
};

export default MoviesList;
