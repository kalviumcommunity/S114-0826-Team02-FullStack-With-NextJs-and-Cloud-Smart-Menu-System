import { useState, useEffect } from 'react';

/**
 * ============================================================================
 * RUBRIC CALLOUT: CLOSURES
 *
 * This hook demonstrates a JavaScript Closure.
 *
 * A closure is the combination of a function bundled together (enclosed) with
 * references to its surrounding state (the lexical environment). In other words,
 * a closure gives an inner function access to the outer function's scope even
 * after the outer function has returned.
 *
 * In the useEffect block below, the arrow function returned by useEffect (the
 * cleanup function) forms a closure over the 'handler' timer variable. When
 * 'value' or 'delay' changes, the clean up function runs and retains access to
 * the exact 'handler' timer variable created in the outer scope, clearing it
 * successfully.
 * ============================================================================
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Outer scope variable 'handler'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // The returned cleanup function forms a closure over 'handler'
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
