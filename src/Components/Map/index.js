import React, {useEffect, useRef, useState, useReducer, useContext} from 'react';
import styled from 'styled-components';
import {AiOutlineSearch} from 'react-icons/ai';

import axios from 'axios';
import { TextValue } from '../../App';
import { SideWhat } from '../../App';

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  flex: 2;
  border: 1px solid black;
  height: 600px;
`;

const MapContainer = styled.div`
  position: relative;
  top: -40px;
  z-index: 1;
`;

const SearchContainer = styled.div`
  position: relative;
  top: 1rem;
  width: 300px;
  height: 40px;
  z-index: 2;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 260px;
  line-height: 40px;
  opacity: 0.8;
  box-sizing: border-box;
`;

const IconContainer = styled.button`
  width: 35px;ㅔ
  margin-left: 2.5px;
  margin-right: 2.5px;
  box-sizing: border-box;
  line-height: 40px;
`;

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null,
        go: false
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
        go: true
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
        go: false
      };
    default:
      throw new Error(`unhandled ${action.type}`);
  }
}

let item1 = [];
let item2 = [];
let item3 = [];

let markers1 = [];
let markers2 = [];
let markers3 = [];

let infoWindows1 = [];
let infoWindows2 = [];
let infoWindows3 = [];

/**
 * x, y 값을 속성으로 가지고, 이것으로 마커들에 개별접근가능
 * 
 */
let viewMarker1 = [];
let viewMarker2 = [];
let viewMarker3 = [];


let markerZoom;
let markerCenter;

const Map = () => {
  const [dataF1, setDataF1] = useState(true);
  const [dataF2, setDataF2] = useState(true);
  const [dataF3, setDataF3] = useState(true);
  
  const [middle, setMiddle] = useState('');

  const [markerState, setMarkerState] = useContext(TextValue);
  const [rec, setRec] = useContext(SideWhat);
  /**
   * 좌표 설정
   */
  const [LatLng, setLatLng] = useState({
    x: 37.5656,
    y: 126.9769,
  })

  /**
   * Ref 객체 생성, .current 프로퍼티를 이용해 값 변경
   */
  const mapElement = useRef(null);
  const { naver } = window;


  const initMap = async () => {

    /**
     * naver 객체가 없거나, mapElement의 값이 없을 때(처음 렌더링될 때) 지도를 불러온다
     */
    if (!mapElement.current || !naver) return;

    /**
     * 위치 생성(LatLng 클래스, 파라미터는 위/경도)
     */

    let infoWindow = new naver.maps.InfoWindow({
      disableAnchor: true,
    })

    const location = new naver.maps.LatLng(LatLng.x, LatLng.y);

    /**
     * json 객체로 Map 객체에 쓰일 지도의 옵션을 정의
     */
    
    let mapOptions = {
        center: location,
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
    }
    

    if(middle === inputValue) {
      if(markerCenter !== undefined || markerZoom !== undefined) {
        mapOptions = {
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT
          },
          center: markerCenter,
          zoom: markerZoom,
        }
      }
    } 
    
    /*if(middle === inputValue) {
      const markerCenter = map.getCenter();
      const markerZoom = map.getZoom();
      mapOptions = {
        center: markerCenter,
        zoom: markerZoom,
      }
    } */

    


    /**
     * 지도 생성 (Map 객체의 첫 번째 파라미터는 지도를 삽입할 div, 두 번째 파라미터는 지도의 옵션 객체)
     */

    const map = new naver.maps.Map(mapElement.current, mapOptions);

    

    /**
     * Point 클래스, 위/경도를 반환하는 인스턴스 생성하여 setCenter 메소드로 지도 위치 변경
     */
    let point = new naver.maps.Point(LatLng.x, LatLng.y);

    if(middle !== inputValue) {
      map.setCenter(point);
      setMiddle(inputValue);
    }
    if(middle === inputValue) {
      if(markerCenter === undefined && markerZoom === undefined) {
        map.setCenter(point);
      }
    }
    
    /**
     * 마커 인스턴스 생성, 위치 변경시마다 뜨지 않아서 뒤에 하나 더 추가함, anchor 속성을 추가하여 정보창 띄움
     */
    let marker = new naver.maps.Marker({
      position: point,
      map,
      anchor: (0, 0),
    })

    /**
     * 검색창에 친 내용 그대로 정보창에 띄움, setContent 메소드,
     * open 메소드로 map에, marker위에 정보창 띄움
     */
    infoWindow.setContent(inputValue);
    infoWindow.open(map, marker);
    console.log('지도 호출');

    if(item1[0] !== undefined) {
      for(let i=0; i<15; i++) {
        if(item1[i] === undefined) {
          let epoint1= new naver.maps.Point(item1[0].x - 0.1, item1[0].y - 0.1)
          let emarker1;
          emarker1 = new naver.maps.Marker({
            position: epoint1,
            map,
            visible: false
          })
        } else {
            let point1 = new naver.maps.Point(item1[i].x, item1[i].y);
            let marker1;
            if(markerState.number !== 'one') {
              marker1 = new naver.maps.Marker({
                position: point1,
                map, 
                visible: false,
              })
            } else {
                marker1 = new naver.maps.Marker({
                  position: point1,
                  map,
                  visible: true,
                })
              }
              var infoWindowT = new naver.maps.InfoWindow({
                content: item1[i].jibunAddress
              })
              infoWindows1.push(infoWindowT);
              markers1.push(marker1);
              for(let j=0; j<markers1.length-1; j++) {
                if(markers1[j].x === item1[i].x) {
                  markers1.splice(j, 1);
                }
              }
        }
      }
    }

    if(item2[0] !== undefined) {
      for(let i=0; i<15; i++) {
        if(item2[i] === undefined) {
          let epoint2= new naver.maps.Point(item2[0].x - 0.1, item2[0].y - 0.1)
          let emarker2;
          emarker2 = new naver.maps.Marker({
            position: epoint2,
            map,
            visible: false
          })
        } else {
            let point2 = new naver.maps.Point(item2[i].x, item2[i].y);
            let marker2;
            if(markerState.number !== 'two') {
              marker2 = new naver.maps.Marker({
                position: point2,
                map, 
                visible: false,
              })
            } else {
              marker2 = new naver.maps.Marker({
                position: point2,
                map,
                visible: true,
              })
            }
            var infoWindowT2 = new naver.maps.InfoWindow({
                content: item2[i].roadAddress
              })
              infoWindows2.push(infoWindowT2);
            markers2.push(marker2);
              for(let j=0; j<markers2.length-1; j++) {
                if(markers2[j].x === item2[i].x) {
                  markers2.splice(j, 1);
                }
              }
        }
      }
    }

    if(item3[0] !== undefined) {
      for(let i=0; i<15; i++) {
        if(item3[i] === undefined) {
          let epoint3= new naver.maps.Point(item3[0].x - 0.1, item3[0].y - 0.1)
          let emarker3;
          emarker3 = new naver.maps.Marker({
            position: epoint3,
            map,
            visible: false
          })
        } else {
          let point3 = new naver.maps.Point(item3[i].x, item3[i].y);
          let marker3;
          if(markerState.number !== 'three') {
            marker3 = new naver.maps.Marker({
              position: point3,
              map, 
              visible: false,
            })
          } else {
            marker3 = new naver.maps.Marker({
              position: point3,
              map,
              visible: true,
            })
          }
          var infoWindowT3 = new naver.maps.InfoWindow({
                content: item3[i].roadAddress
              })
              infoWindows3.push(infoWindowT3);
          markers3.push(marker3);
              for(let j=0; j<markers3.length-1; j++) {
                if(markers3[j].x === item3[i].x) {
                  markers3.splice(j, 1);
                }
              }  
        }
      }
    }
    
    markerZoom = map.getZoom();
    markerCenter = map.getCenter();
    /**
     * 렌더링이 되고 나서야 바뀐 것을 깨닫는다.
     */
    if(markerState.number === 'one') {
      setRec(viewMarker1);
    }
    if(markerState.number === 'two') {
      setRec(viewMarker2);
    }
    if(markerState.number === 'three') {
      setRec(viewMarker3);
    }

    naver.maps.Event.addListener(map, 'idle', function() {
      if(markerState.number === 'one') {
        updateMarkers(map, markers1, viewMarker1);
        hideUpdateMarkers(map, markers2, viewMarker2);
        hideUpdateMarkers(map, markers3, viewMarker3);
        setRec(viewMarker1);
      }
      if(markerState.number === 'two') {
        updateMarkers(map, markers2, viewMarker2);
        hideUpdateMarkers(map, markers1, viewMarker1);
        hideUpdateMarkers(map, markers3, viewMarker3);
        setRec(viewMarker2);
      }
      if(markerState.number === 'three') {
        updateMarkers(map, markers3, viewMarker3);
        hideUpdateMarkers(map, markers1, viewMarker1);
        hideUpdateMarkers(map, markers2, viewMarker2);
        setRec(viewMarker2);
      }

      markerZoom = map.getZoom();
      markerCenter = map.getCenter();
  });

  for(let i=0; i<markers1.length; i++) {
    naver.maps.Event.addListener(markers1[i], 'click', getClickHandler(i, markers1, infoWindows1, map));
  }
  for(let i=0; i<markers2.length; i++) {
    naver.maps.Event.addListener(markers2[i], 'click', getClickHandler(i, markers2, infoWindows2, map));
  }
  for(let i=0; i<markers3.length; i++) {
    naver.maps.Event.addListener(markers3[i], 'click', getClickHandler(i, markers3, infoWindows3, map));
  }
  }

  useEffect(() => {
    initMap();
  }, [LatLng, markerState]);

  /* 이제부터 할 것은 TextValue를 콘텍스트로 가지고 와서, 그 값이 변할 때마다 맵을 재렌더링하도록 한 후(useEffect 배열에 넣어서)
  그것에 해당하는 마커만 보이게 하고, 나머지는 보이지 않게 하는 것(업데이트는 같이) */

  const [inputValue, setInputValue] = useState(``);

  const onChangeValue = (e) => {
    setInputValue(e.target.value);
  };

  function searchAddress() {
    naver.maps.Service.geocode({
        query: inputValue
      }, function(status, response) {
        if(status === naver.maps.Service.Status.ERROR) {
          console.log('오류');
        }
        let item = response.v2.addresses[0];
        setLatLng({
          x: item.x,
          y: item.y,
        })
      })
  }


  function updateMarkers(map, markersA, viewMarker) {
    var mapBounds = map.getBounds();
    var marker, position;
    var x, y;

    for (var i = 0; i < markersA.length; i++) {
      marker = markersA[i];
      position = marker.getPosition();


      if(mapBounds.hasLatLng(position)) {
        x = position.x;
        y = position.y;
        showMarker(map, marker);
        viewMarker.push(position)
        for(let j=0; j<viewMarker.length -1 ; j++) {
          if(viewMarker[j].x === x) {
            viewMarker.splice(j, 1);
          }
        }
      } else {
        x = position.x;
        y = position.y;
        hideMarker(map, marker);
        for(var j=0; j<viewMarker.length; j++) {
          if(viewMarker[j].x === x) {
            viewMarker.splice(j, 1);
          }
        }
      }
    }
    console.log(viewMarker);
  }

  function hideUpdateMarkers(map, markersA, viewMarker) {
    var mapBounds = map.getBounds();
    var marker, position;
    var x, y;
    for(var i=0; i<markersA.length; i++) {
      marker = markersA[i];
      position = marker.getPosition();

      if(mapBounds.hasLatLng(position)) {
        x = position.x;
        y = position.y;
        hideMarker(map, marker);
        viewMarker.push(position)
        for(let j=0; j<viewMarker.length -1 ; j++) {
          if(viewMarker[j].x === x) {
            viewMarker.splice(j, 1);
          }
        }
      } else {
        x = position.x;
        y = position.y;
        hideMarker(map, marker);
        for(var j=0; j<viewMarker.length; j++) {
          if(viewMarker[j].x === x) {
            viewMarker.splice(j, 1);
          }
        }
      }
    } 
  }

  function showMarker(map, marker) {
    if (marker.getMap()) return;
    marker.setMap(map);
  }

  function hideMarker(map, marker) {
    if (!marker.getMap()) return;
    marker.setMap(null);
  }

  function getClickHandler(seq, markersA, infoWindowsA, map) {
    return function(e) {
      var marker = markersA[seq];
      var infoWindowA = infoWindowsA[seq];
      if(infoWindowA.getMap()) {
        infoWindowA.close();
      } else {
        infoWindowA.open(map, marker);
      }
    }
  }

  const [state1, dispatch1] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
    go: false
  });

  const [state2, dispatch2] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
    go: false
  })

  const [state3, dispatch3] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
    go: false
  })

  const fetchUsers = async () => {
    dispatch1({ type: 'LOADING' });
    try {
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/viewAmenitiesInfo/1/1000/` 
      );
      dispatch1({ type: 'SUCCESS', data: response.data, go: true });
      setDataF1(false);
    } catch (e) {
      dispatch1({ type: 'ERROR', error: e });
    }
  };

  const fetchUsers2 = async () => {
    dispatch2({ type: 'LOADING' });
    try {
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/stayLodgeInfo/1/292/` 
      );
      dispatch2({ type: 'SUCCESS', data: response.data, go: true });
      setDataF2(false);
    } catch (e) {
      dispatch2({ type: 'ERROR', error: e });
    }
  };

  const fetchUsers3 = async () => {
    dispatch3({ type: 'LOADING' });
    try {
      const response = await axios.get(
        `http://openapi.seoul.go.kr:8088/486857594b726863383574794f4669/json/touristFoodInfo/1/150/` 
      );
      dispatch3({ type: 'SUCCESS', data: response.data, go: true });
      setDataF3(false);
    } catch (e) {
      dispatch3({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUsers2();
    fetchUsers3();
  }, []);



  if(state1.loading || state2.loading || state3.loading) return (
    <div>로딩 중</div>
  );
  if(state1.error || state2.error || state3.error) return (
    <div>에러</div>
  );
  if(!state1.data || !state2.data || !state3.data) return null;
  
  if(state1.data && !dataF1) {
    for(let i=0; i<15; i++) {
        naver.maps.Service.geocode({
        query: state1.data.viewAmenitiesInfo.row[i].ADDR
      }, function (status, response) {
        if(status === naver.maps.Service.Status.ERROR) {
          console.log('오류');
        }
        item1[i] = response.v2.addresses[0];
      })
    }
    setDataF1(true);
  }
  if(state2.data && !dataF2) {
    for(let i=0; i<15; i++) {
        naver.maps.Service.geocode({
        query: state2.data.stayLodgeInfo.row[i].ADDR
      }, function (status, response) {
        if(status === naver.maps.Service.Status.ERROR) {
          console.log('오류');
        }
        item2[i] = response.v2.addresses[0];
      })
    }
    setDataF2(true);
  }
  if(state3.data && !dataF3) {
    for(let i=0; i<15; i++) {
        naver.maps.Service.geocode({
        query: state3.data.touristFoodInfo.row[i].ADDR
      }, function (status, response) {
        if(status === naver.maps.Service.Status.ERROR) {
          console.log('오류');
        }
        item3[i] = response.v2.addresses[0];
      })
    }
    setDataF3(true);
  }

  return (
    <Container>
      <SearchContainer>
        <Input placeholder="검색" onChange={onChangeValue} value={inputValue}/>
        <IconContainer>
          <AiOutlineSearch size='20' color='green' style={{marginBottom: '-5px'}} onClick={() => {
            searchAddress()
            }}/>
        </IconContainer>
      </SearchContainer>
      <MapContainer>
        <div ref={mapElement} style={{ minHeight: '600px'}}></div>
      </MapContainer>
    </Container>
  );
};

export default Map;

/*
다음 할 것은 사이드바와 마커 연동
일단 지도에 나오는 마커(viewMarkers1, 2, 3)만 오른쪽 사이드바에 띄우게 하고(버튼 클릭 시에만, 옮기는 데에는 재렌더링되지 않도록),
사이드바 내용을 누르면 마커 정보창 띄우기*/