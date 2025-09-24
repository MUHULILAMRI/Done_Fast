"use client";

import React, { useState, useEffect, useRef } from 'react';

interface RobotEyeProps {
  size?: number; // Size of the outer eye circle
  pupilSize?: number; // Size of the pupil
  color?: string; // Color of the outer eye
  pupilColor?: string; // Color of the pupil
  maxPupilMove?: number; // Max movement of pupil from center
}

export const RobotEye: React.FC<RobotEyeProps> = ({
  size = 100,
  pupilSize = 40,
  color = '#333',
  pupilColor = '#fff',
  maxPupilMove = 20,
  pupilOnly = false,
}) => {
  const [pupilTransform, setPupilTransform] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!eyeRef.current) return;

      const eyeRect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      let clientX: number;
      let clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else { // TouchEvent
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      const deltaX = clientX - eyeCenterX;
      const deltaY = clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);

      const moveX = Math.cos(angle) * maxPupilMove;
      const moveY = Math.sin(angle) * maxPupilMove;

      setPupilTransform({ x: moveX, y: moveY });
    };

    // Add event listeners for both mouse and touch
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, [maxPupilMove]);

  return (
    <div
      ref={eyeRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: pupilOnly ? 'transparent' : color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Keep pupil inside eye
        position: 'relative',
      }}
    >
      <div
        style={{
          width: pupilSize,
          height: pupilSize,
          borderRadius: '50%',
          backgroundColor: pupilColor,
          position: 'absolute',
          transform: `translate(${pupilTransform.x}px, ${pupilTransform.y}px)`,
        }}
      />
    </div>
  );
};
