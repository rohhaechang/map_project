import React, {useEffect, useReducer, useState, useContext} from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';
import axios from 'axios';

import { TextValue, SideWhat } from '../../App';

const Container = styled.div`
  box-sizing: border-box;
  flex: 1;
  border: 1px solid black;
  height: 600px;
  display: flex;
  flex-direction: column;
`;

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

const ListContainer = styled.div`
  flex: 4;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex-wrap: no-wrap;
`;


const Inside = styled.button`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  line-height: 95.04px;
  background-color: white;
  &:hover {
    background-color: ${(lighten(0.1, 'lightgray'))};
  }
  &:active {
    background-color: ${(darken(0.1, 'lightgray'))};
  }
  font-size: 16px;
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
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`unhandled ${action.type}`);
  }
}

const Side = () => {

  const [state1, dispatch1] = useContext(TextValue);

  const [what, setWhat] = useState('viewAmenitiesInfo');

  const [rec, setRec] = useContext(SideWhat);

  const [hall, setHall] = useState([]);
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
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/viewAmenitiesInfo/1/1000/` 
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
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/stayLodgeInfo/1/292/` 
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
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/touristFoodInfo/1/150/` 
      );
      dispatch({ type: 'SUCCESS', data: response.data });
      setWhat('touristFoodInfo');
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };
  
  const { naver } = window;
  async function call() {
    for(var i=0; i<rec.length; i++) {
      let a = rec[i].x;
      let b = rec[i].y;
      if(a && b) {
        naver.maps.Service.reverseGeocode({
          location: new naver.maps.LatLng(b, a),
        }, function(status, response) {
          if(status !== naver.maps.Service.Status.OK) {
            return alert('오류');
          }
          var items = response.v2.address.roadAddress;
          getArray.push(items);
        })
      }
      else {
        console.log('오류');
      }
    }
    setHall(getArray);
    console.log(getArray);
  }
  
  function aaa() {
    console.log(rec);
  }


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
  let getArray = [];

  if(state.loading) return (
    <Container>
      <IconContainer>
        <Icon onClick={fetchUsers}>장애인 관광편의시설</Icon>
        <Icon onClick={fetchUsers2}>장애인 관광숙박</Icon>
        <Icon onClick={fetchUsers3}>장애인 관광음식점</Icon>
      </IconContainer>
      <ListContainer>
        로딩 중
      </ListContainer>
    </Container>
  );
  if(state.error) return  (
    <Container>
      <IconContainer>
        <Icon onClick={fetchUsers}>장애인 관광편의시설</Icon>
        <Icon onClick={fetchUsers2}>장애인 관광숙박</Icon>
        <Icon onClick={fetchUsers3}>장애인 관광음식점</Icon>
      </IconContainer>
      <ListContainer>
        에러
      </ListContainer>
    </Container>
  );
  if(!state.data) return null;
  if(state.data && what === 'viewAmenitiesInfo') {
    for(let i=0; i<1000; i++) {
      array[i] = state.data.viewAmenitiesInfo.row[i];
    }
    console.log('편의 로딩 완료');
  }
  if(state.data && what === 'stayLodgeInfo') {
    for(let i=0; i<292; i++) {
      array[i] = state.data.stayLodgeInfo.row[i];
    }
    console.log('숙박 로딩 완료');
  }
  if(state.data && what === 'touristFoodInfo') {
    for(let i=0; i<150; i++) {
      array[i] = state.data.touristFoodInfo.row[i];
    }
    console.log('음식점 로딩 완료');
  }

  
  
  return (
    <Container>
      <IconContainer>
        <Icon onClick={() => {
          fetchUsers();
          dispatch1({type: "a"})
          call();
          
          aaa()
          }}>장애인 관광편의시설</Icon>
        <Icon onClick={() => {
          fetchUsers2();
          dispatch1({type: "b"})
          call();
          
          aaa()
        }}>장애인 관광숙박</Icon>
        <Icon onClick={() => {
          fetchUsers3();
          dispatch1({type: "c"})
          call();
          
          aaa()
        }}>장애인 관광음식점</Icon>
      </IconContainer>
      <ListContainer>
        {hall.map((e) => <Inside key={e}>{e}</Inside>)}
      </ListContainer>
    </Container>
  );
};

export default Side;