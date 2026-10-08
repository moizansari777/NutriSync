import { useEffect, useRef, useState } from "react";

export const useTimer = (durationInSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
      clearInterval(intervalRef.current!);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const startTimer = (seconds: number = durationInSeconds) => {
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    formattedTime: `${String(Math.floor(timeLeft / 60)).padStart(
      2,
      "0",
    )}:${String(timeLeft % 60).padStart(2, "0")}`,
  };
};
