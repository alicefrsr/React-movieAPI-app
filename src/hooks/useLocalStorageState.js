import { useEffect, useState } from 'react';

export const useLocalStorageState = (initialState, key) => {
  // get state from local storage if it exists, else use intial state (set to [])
  const storedValue = () => JSON.parse(localStorage.getItem(key)) || initialState;

  // set state to be whichever of the above, storedValue or initial state []
  const [value, setValue] = useState(storedValue);

  // update/set state in local storage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
