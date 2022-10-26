import React from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';

const IconContainer = styled.div`
  flex: 1;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
`;

const Icon = styled.button`
  flex: 1;
  box-sizing: border-box;
  border: 1px solid black;
  background-color: beige;
  &:hover {
    background-color: ${(lighten(0.1, 'beige'))};
  }
  &:active {
    background-color: ${(darken(0.1, 'beige'))};
  }
`;

const ListIcons = () => {
  return (
    <IconContainer>
      <Icon />
      <Icon />
      <Icon />
    </IconContainer>
  );
};

export default ListIcons;