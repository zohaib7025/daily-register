import { useEffect, useRef, useState } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  isSwiping: boolean;
}

interface UseSwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  disabled?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  disabled = false,
}: UseSwipeNavigationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isSwiping: false,
  });
  const [swipeOffset, setSwipeOffset] = useState(0);

  useEffect(() => {
    if (disabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setSwipeState({
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        isSwiping: true,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipeState.isSwiping) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - swipeState.startX;
      const deltaY = touch.clientY - swipeState.startY;
      
      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
        setSwipeOffset(deltaX * 0.3); // Dampened movement
        setSwipeState(prev => ({ ...prev, currentX: touch.clientX }));
      }
    };

    const handleTouchEnd = () => {
      const deltaX = swipeState.currentX - swipeState.startX;
      
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
      
      setSwipeState({
        startX: 0,
        startY: 0,
        currentX: 0,
        isSwiping: false,
      });
      setSwipeOffset(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, swipeState.isSwiping, swipeState.startX, swipeState.currentX, swipeState.startY, threshold, onSwipeLeft, onSwipeRight]);

  return { containerRef, swipeOffset, isSwiping: swipeState.isSwiping };
};
