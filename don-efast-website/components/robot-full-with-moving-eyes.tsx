"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { RobotEye } from './robot-eye';

interface RobotFullWithMovingEyesProps {
  robotSize?: number; // Overall size of the robot
  pupilSize?: number; // Size of the moving pupil
  pupilColor?: string; // Color of the pupil
  maxPupilMove?: number; // Max movement of pupil from center
  robotMoveSensitivity?: number; // How much the robot moves with cursor
  robotMoveRange?: number; // Max range the robot can move from its center
}

export const RobotFullWithMovingEyes: React.FC<RobotFullWithMovingEyesProps> = ({
  robotSize = 200,
  pupilSize = 8,
  pupilColor = '#3536c0',
  maxPupilMove = 3,
  robotMoveSensitivity = 0.05,
  robotMoveRange = 10, // Reduced range for subtle movement
}) => {
  const [robotTransform, setRobotTransform] = useState({ x: 0, y: 0 });
  const robotRef = useRef<HTMLDivElement>(null);

  // Coordinates of the eyes within the 128x128 SVG viewBox
  const eye1Cx = 54.105; // X-coordinate for the first eye
  const eye1Cy = 55.598; // Y-coordinate for the first eye
  const eye2Cx = 73.895; // X-coordinate for the second eye
  const eye2Cy = 55.598; // Y-coordinate for the second eye
  const eyeRadius = 3.098; // Radius of the eye socket in the SVG

  // Calculate positions relative to the robotSize
  const scale = robotSize / 128; // SVG viewBox is 128x128

  const scaledEye1X = eye1Cx * scale;
  const scaledEye1Y = eye1Cy * scale;
  const scaledEye2X = eye2Cx * scale;
  const scaledEye2Y = eye2Cy * scale;
  const scaledEyeRadius = eyeRadius * scale;

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!robotRef.current) return;

      const robotRect = robotRef.current.getBoundingClientRect();
      const robotCenterX = robotRect.left + robotRect.width / 2;
      const robotCenterY = robotRect.top + robotRect.height / 2;

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

      const deltaX = clientX - robotCenterX;
      const deltaY = clientY - robotCenterY;

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
        position: 'relative',
        zIndex: 100,
        transform: `translate(${robotTransform.x}px, ${robotTransform.y}px)`,
        pointerEvents: 'auto', // Allow interaction
      }}
    >
      <Image
        src="/robot-full.svg"
        alt="Robot Full Body"
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
