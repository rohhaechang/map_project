import styled from 'styled-components';
import { useReducer, createContext, useState } from 'react';

import Side from './Components/Side';
import Map from './Components/Map';
import { sideReducer, initialValue } from './Components/contexts/sideReducer';
import { sideValue } from './Components/contexts/contextA';

const Container = styled.div`
  display: flex;
`;

export const TextValue = createContext();
export const SideWhat = createContext();

function App() {
  return (
    <div className="App">
      <TextValue.Provider value={useReducer(sideReducer, initialValue)}>
        <SideWhat.Provider value={useState(sideValue)}>
          <Container>
            <Map></Map>
            <Side></Side>
          </Container>
        </SideWhat.Provider>
      </TextValue.Provider>
    </div>
  );
}

export default App;
