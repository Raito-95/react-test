import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedContainer = styled(Box)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2196F3;
  color: #fff;
  animation: ${fadeIn} 1.5s ease-in;
  z-index: 9999;
`;

const EntranceAnimation = ({ onAnimationEnd }) => {
  const [animationVisible, setAnimationVisible] = useState(true);

  const handleStartExploring = () => {
    setAnimationVisible(false);
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  };

  return (
    animationVisible && (
      <AnimatedContainer>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Welcome to My Website!
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleStartExploring}>
          Start Exploring
        </Button>
      </AnimatedContainer>
    )
  );
};

export default EntranceAnimation;
