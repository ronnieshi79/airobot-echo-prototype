import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialSeconds: number, onComplete?: () => void) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, seconds, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newSeconds?: number) => {
    setIsRunning(false);
    setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds);
  };
  const adjust = (amount: number) => {
    if (!isRunning) {
      setSeconds(prev => Math.max(0, prev + amount));
    }
  };

  return { seconds, isRunning, start, pause, reset, adjust, setSeconds };
};
