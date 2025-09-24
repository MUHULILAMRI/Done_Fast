"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { RobotEye } from './robot-eye';

interface RobotHeadWithMovingEyesProps {
  robotSize?: number; // Overall size of the robot head
  pupilSize?: number; // Size of the moving pupil
  pupilColor?: string; // Color of the pupil
  maxPupilMove?: number; // Max movement of pupil from center
  robotMoveSensitivity?: number; // How much the robot moves with cursor
  robotMoveRange?: number; // Max range the robot can move from center
}

export const RobotHeadWithMovingEyes: React.FC<RobotHeadWithMovingEyesProps> = ({
  robotSize = 150,
  pupilSize = 10,
  pupilColor = '#00bcd4',
  maxPupilMove = 5,
  robotMoveSensitivity = 0.05,
  robotMoveRange = 50,
}) => {
  const [robotTransform, setRobotTransform] = useState({ x: 0, y: 0 });
  const robotRef = useRef<HTMLDivElement>(null);

  // Coordinates of the eyes within the 64x64 SVG viewBox
  const eye1X = 24; // X-coordinate for the first eye
  const eye1Y = 28; // Y-coordinate for the first eye
  const eye2X = 40; // X-coordinate for the second eye
  const eye2Y = 28; // Y-coordinate for the second eye
  const eyeRadius = 6; // Approximate radius of the eye socket in the SVG

  // Calculate positions relative to the robotSize
  const scale = robotSize / 64; // SVG viewBox is 64x64

  const scaledEye1X = eye1X * scale;
  const scaledEye1Y = eye1Y * scale;
  const scaledEye2X = eye2X * scale;
  const scaledEye2Y = eye2Y * scale;
  const scaledEyeRadius = eyeRadius * scale;

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
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

      // Calculate movement relative to viewport center
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const deltaX = clientX - viewportCenterX;
      const deltaY = clientY - viewportCenterY;

      // Apply sensitivity and constrain movement
      const moveX = Math.max(-robotMoveRange, Math.min(robotMoveRange, deltaX * robotMoveSensitivity));
      const moveY = Math.max(-robotMoveRange, Math.min(robotMoveRange, deltaY * robotMoveSensitivity));

      setRobotTransform({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [robotMoveSensitivity, robotMoveRange]);

  return (
    <div
      ref={robotRef}
      style={{
        width: robotSize,
        height: robotSize,
        position: 'absolute', // Changed to absolute for central positioning
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${robotTransform.x}px, ${robotTransform.y}px)`,
        zIndex: 100,
        pointerEvents: 'none', // Allow clicks/hovers to pass through to elements behind
      }}
    >
      <Image
        src="/robot-head.svg"
        alt="Robot Head"
        width={robotSize}
        height={robotSize}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      {/* Left Eye Pupil */}
      <div
        style={{
          position: 'absolute',
          left: scaledEye1X - scaledEyeRadius,
          top: scaledEye1Y - scaledEyeRadius,
          width: scaledEyeRadius * 2,
          height: scaledEyeRadius * 2,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RobotEye
          size={scaledEyeRadius * 2} // Size of the eye socket for pupil movement
          pupilSize={pupilSize}
          pupilColor={pupilColor}
          maxPupilMove={maxPupilMove}
          pupilOnly={true}
        />
      </div>

      {/* Right Eye Pupil */}
      <div
        style={{
          position: 'absolute',
          left: scaledEye2X - scaledEyeRadius,
          top: scaledEye2Y - scaledEyeRadius,
          width: scaledEyeRadius * 2,
          height: scaledEyeRadius * 2,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RobotEye
          size={scaledEyeRadius * 2} // Size of the eye socket for pupil movement
          pupilSize={pupilSize}
          pupilColor={pupilColor}
          maxPupilMove={maxPupilMove}
          pupilOnly={true}
        />
      </div>
    </div>
  );
};
