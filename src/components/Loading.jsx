import PuffLoader from 'react-spinners/PuffLoader';

const Loading = () => {
  return (
    <PuffLoader
      className='loader'
      color={'#6741d9'}
      // size={40}
      aria-label={'Loading spinner'}
    />
  );
};

export default Loading;
