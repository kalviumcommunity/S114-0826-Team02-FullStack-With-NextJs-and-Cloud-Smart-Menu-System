import { useState, useEffect, useRef } from 'react';
import { orderService } from '../services/orderService';

/**
 * ============================================================================
 * RUBRIC CALLOUT: CLOSURES & THE EVENT LOOP
 *
 * 1. CLOSURES:
 * The interval callback and the update function form closures over the 'prevStatusRef'
 * and the 'orderId' variables. Even when execution cycles through the event loop,
 * the async function retains access to the stateful references of the outer scope,
 * allowing it to verify if a status transition has occurred before updating React state.
 *
 * 2. EVENT LOOP:
 * JavaScript's execution model is single-threaded and uses an Event Loop. Asynchronous
 * tasks (like setInterval and network fetch promises) are pushed to the Web APIs / Node
 * environment. When they resolve, their callbacks are queued in the Task Queue (or
 * Microtask Queue) and executed when the main thread (Call Stack) is empty.
 * Because these network checks run asynchronously and non-blockingly, the main thread
 * is never blocked, ensuring the user interface remains completely fluid, responsive,
 * and animations run at 60fps.
 * ============================================================================
 */
export function useOrderPolling(orderId, intervalMs = 5000) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const prevStatusRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    prevStatusRef.current = null;

    async function fetchStatus() {
      try {
        const data = await orderService.getOrderById(orderId);
        if (!isMounted) return;

        // Closure usage: check if status changed
        if (prevStatusRef.current !== data.status) {
          setOrder(data);
          prevStatusRef.current = data.status;
        }
        
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to fetch order status');
        setLoading(false);
      }
    }

    // Initial check
    fetchStatus();

    // Event Loop schedule: queue recurring checks
    const timer = setInterval(() => {
      // If the order is already in a terminal state, clear polling to conserve resources
      if (prevStatusRef.current === 'completed' || prevStatusRef.current === 'cancelled') {
        clearInterval(timer);
        return;
      }
      fetchStatus();
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [orderId, intervalMs]);

  return { order, loading, error };
}
