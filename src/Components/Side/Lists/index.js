import React, {useEffect, useReducer, useState} from 'react';
import styled from 'styled-components';

import axios from 'axios';

const ListContainer = styled.div`
  flex: 4;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex-wrap: no-wrap;
`;

const Button = styled.button`
  width: 50px;
  height: 50px;
`

const Inside = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  line-height: 95.04px;
`;

/**
 * useReducer를 이용하여 상태관리, 처음에 리듀서 함수를 만들어 각각의 상태를 만든다
 */

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`unhandled ${action.type}`);
  }
}

const Lists = () => {
  
  const [what, setWhat] = useState('viewAmenitiesInfo');

  /**
   * useReducer 생성, reducer 함수와 초기 상태를 파라미터로 가져온다
   */
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null
  });
  /**
   * api 요청, 처음에는 Loading, 연결이 된 후에는 SUCCESS, 에러가 나면 ERROR 상태를 가지게 한다
   * 이때, dispatch를 이용해 상태를 관리한다
   */
  const fetchUsers = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/viewAmenitiesInfo/1/100/` 
      );
      dispatch({ type: 'SUCCESS', data: response.data });
      setWhat('viewAmenitiesInfo');
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  const fetchUsers2 = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/stayLodgeInfo/1/100/` 
      );
      dispatch({ type: 'SUCCESS', data: response.data });
      setWhat('stayLodgeInfo');
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  const fetchUsers3 = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/touristFoodInfo/1/100/` 
      );
      dispatch({ type: 'SUCCESS', data: response.data });
      setWhat('touristFoodInfo');
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };


  // 받아오는 api가 이름빼고는 동일하니 파라미터에 이름을 집어넣어 재사용하는 방식으로 가자
  // 하지만 아직 익숙치 않으니 일단 다 생성해보자


  /**
   * useEffect를 이용해 api 요청을 처음 렌더링시에 한다
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * 사용해야 하는 값이 배열 안에 숨어있었기 때문에 따로 배열을 생성하여 저장하였다
   */
  let array = [];

  if(state.loading) return <div>로딩 중...</div>;
  if(state.error) return  <div>에러가 발생했습니다</div>;
  if(!state.data) return null;
  if(state.data && what === 'viewAmenitiesInfo') {
    for(let i=0; i<100; i++) {
      array[i] = state.data.viewAmenitiesInfo.row[i];
    }
    console.log(array);
  }
  if(state.data && what === 'stayLodgeInfo') {
    for(let i=0; i<100; i++) {
      array[i] = state.data.stayLodgeInfo.row[i];
    }
    console.log(array);
  }
  if(state.data && what === 'touristFoodInfo') {
    for(let i=0; i<100; i++) {
      array[i] = state.data.touristFoodInfo.row[i];
    }
    console.log(array);
  }
  return (
    <ListContainer>
      <Button onClick={fetchUsers}>다시 불러오기1</Button>
      <Button onClick={fetchUsers2}>다시 불러오기2</Button>
      <Button onClick={fetchUsers3}>다시 불러오기3</Button>
      {array.map((e) => <Inside>{e.SISULNAME} ({e.ADDR})</Inside>)}
      
    </ListContainer>
  )

/*
  let responseArray = [];

  const getData = async () => {
    const response = await fetch(
      'http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/viewAmenitiesInfo/1/5/' 
    ).then((response) => response.json());
    responseArray = response.viewAmenitiesInfo.row;
    console.log(responseArray);
  }

  useEffect(() => {
    getData();
  }, []);

  let show = [
    {
      ADDR: 1,
      TEL: 2,
    },
    {
      ADDR: 2,
      TEL: 3,
    }
  ];


    if(responseArray[1] !== undefined) {
      show = responseArray.map((e)=><Inside key={e.ADDR}>{e.TEL}</Inside>)
    }
    else {
      show = show.map((e) => <Inside key={e.ADDR}>{e.TEL}</Inside>)
    }





  return (
    <Container>
      <Button onClick={getData} />
      {show}
    </Container>
  ); */
};

export default Lists;