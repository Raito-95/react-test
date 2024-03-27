import styled from "@emotion/styled";

const EntranceAnimation = styled.div`
  @keyframes fancyEntrance {
    0% {
      transform: translateX(-100%) scale(0.5) rotate(-45deg);
      opacity: 0;
      background-color: rgba(33, 150, 243, 0.7);
    }
    50% {
      transform: translateX(0%) scale(1.2) rotate(20deg);
      opacity: 0.5;
      background-color: rgba(33, 150, 243, 0.4);
    }
    100% {
      transform: translateX(0%) scale(1) rotate(0deg);
      opacity: 1;
      background-color: transparent;
    }
  }

  animation: fancyEntrance 2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default EntranceAnimation;
