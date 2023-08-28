import { useEffect } from 'react';

export function useKey(key, action) {
  useEffect(() => {
    const callback = e => {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    };
    document.addEventListener('keydown', callback);
    // clean up
    return function () {
      document.removeEventListener('keydown', callback);
    };
  }, [action, key]);
}
