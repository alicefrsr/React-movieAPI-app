const NumResults = ({ movies }) => {
  return (
    <p className='numResults'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

export default NumResults;
