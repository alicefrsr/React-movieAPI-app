import { useState } from 'react';

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button
        className='btnToggle'
        onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
};
// refactored into a reusable Box
// const WatchedMoviesBox = () => {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className='box'>
//       <button
//         className='btnToggle'
//         onClick={() => setIsOpen2(open => !open)}>
//         {isOpen2 ? '–' : '+'}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// };

export default Box;
