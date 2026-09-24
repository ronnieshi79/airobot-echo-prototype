import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ContextType,
  ServiceSlice,
  ContextComputationParams
} from './types';
import { detectAutoContext, getContextServiceSlices } from './contextEngine';

export interface UseContextSlicesProps extends Omit<ContextComputationParams, 'context'> {
  initialContext?: ContextType | 'auto';
}

export interface UseContextSlicesReturn {
  selectedContext: ContextType | 'auto';
  effectiveContext: ContextType;
  isAuto: boolean;
  setSelectedContext: (ctx: ContextType | 'auto') => void;
  slices: ServiceSlice[];
  activeSliceIndex: number;
  setActiveSliceIndex: (index: number | ((prev: number) => number)) => void;
  currentSlice: ServiceSlice | null;
  prevSlice: ServiceSlice | null;
  nextSlice: ServiceSlice | null;
  primaryReason: string;
  primaryAction: string;
  goToNext: () => void;
  goToPrev: () => void;
}

export function useContextSlices(props: UseContextSlicesProps): UseContextSlicesReturn {
  const {
    initialContext = 'auto',
    now,
    schedules,
    todos,
    episodes,
    alarms,
    isFocusRunning,
    focusTime,
    totalFocusSeconds,
    isTimerRunning,
    timerSeconds,
    totalTimerSeconds,
    isPlaying,
    activeEpisode,
    ringingAlarmId
  } = props;

  const [selectedContext, setSelectedContext] = useState<ContextType | 'auto'>(initialContext);
  const [activeSliceIndex, setActiveSliceIndex] = useState(0);

  // Compute effective context: if 'auto', use detectAutoContext(now)
  const isAuto = selectedContext === 'auto';
  const effectiveContext: ContextType = isAuto ? detectAutoContext(now) : selectedContext;

  // Memoized computation of service slices via contextEngine
  const { slices, primaryReason, primaryAction, activeLiveSlice } = useMemo(() => {
    return getContextServiceSlices({
      context: effectiveContext,
      now,
      schedules,
      todos,
      episodes,
      alarms,
      isFocusRunning,
      focusTime,
      totalFocusSeconds,
      isTimerRunning,
      timerSeconds,
      totalTimerSeconds,
      isPlaying,
      activeEpisode,
      ringingAlarmId
    });
  }, [
    effectiveContext,
    now,
    schedules,
    todos,
    episodes,
    alarms,
    isFocusRunning,
    focusTime,
    totalFocusSeconds,
    isTimerRunning,
    timerSeconds,
    totalTimerSeconds,
    isPlaying,
    activeEpisode,
    ringingAlarmId
  ]);

  // Keep index within bounds if slices change
  useEffect(() => {
    if (activeSliceIndex >= slices.length && slices.length > 0) {
      setActiveSliceIndex(0);
    }
  }, [slices.length, activeSliceIndex]);

  // Automatically jump to dynamic slice when one becomes active (e.g. alarm ringing or focus started)
  const prevLiveIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (activeLiveSlice && activeLiveSlice.id !== prevLiveIdRef.current) {
      prevLiveIdRef.current = activeLiveSlice.id;
      const idx = slices.findIndex(s => s.id === activeLiveSlice.id);
      if (idx !== -1) {
        setActiveSliceIndex(idx);
      }
    } else if (!activeLiveSlice) {
      prevLiveIdRef.current = undefined;
    }
  }, [activeLiveSlice, slices]);

  const currentSlice = slices[activeSliceIndex] || slices[0] || null;
  const total = slices.length;
  const prevSlice = total > 1 ? slices[(activeSliceIndex - 1 + total) % total] : null;
  const nextSlice = total > 1 ? slices[(activeSliceIndex + 1) % total] : null;

  const goToNext = () => {
    if (total <= 1) return;
    setActiveSliceIndex((prev) => (prev + 1) % total);
  };

  const goToPrev = () => {
    if (total <= 1) return;
    setActiveSliceIndex((prev) => (prev - 1 + total) % total);
  };

  return {
    selectedContext,
    effectiveContext,
    isAuto,
    setSelectedContext,
    slices,
    activeSliceIndex,
    setActiveSliceIndex,
    currentSlice,
    prevSlice,
    nextSlice,
    primaryReason,
    primaryAction,
    goToNext,
    goToPrev
  };
}
