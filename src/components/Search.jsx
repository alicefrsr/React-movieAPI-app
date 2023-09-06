import { useEffect, useRef, useState } from 'react';
import { useKey } from '../hooks/useKey';

const Search = ({ query, setQuery, onCloseDetails }) => {
  const inputEl = useRef(null);

  useKey('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    onCloseDetails();
    setQuery('');
  });

  // replaced with useKey()
  // useEffect(() => {
  //   const callback = e => {
  //     if (e.code === 'Enter') {
  //       if (document.activeElement === inputEl.current) return;
  //       inputEl.current.focus();
  //       setQuery('');
  //     }
  //   };
  //   document.addEventListener('keydown', callback);
  //   // cleanup
  //   return () => document.removeEventListener('keydown', callback);
  // }, [setQuery]);

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={e => setQuery(e.target.value)}
      autoFocus
      ref={inputEl}
    />
  );
};

export default Search;
