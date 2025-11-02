export const MAP_STYLE_DARK = [
  // 🔹 지도 기본 배경 색상
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },

  // 🔹 지도 내 텍스트 스타일 (테두리 & 채우기)
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e5a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },

  // 🔹 행정구역 (국가, 도시 등) 테두리 색상
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  // 🔹 도시 이름 텍스트 색상
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'administrative.locality',
    stylers: [{ visibility: 'inherit' }],
  },

  // 🔹 관심지점 (POI) (예: 상점, 건물 등) 스타일
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#303030' }], // 기본 건물 색상
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }], // POI 텍스트 색상
  },

  // 🔹 공원(공원, 녹지) 스타일
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }], // 공원 배경 색상
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }], // 공원 내 텍스트 색상
  },

  // 🔹 도로 기본 스타일
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#38414e' }], // 도로 기본 색상
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }], // 도로 경계선 색상
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }], // 도로 텍스트 색상
  },

  // 🔹 고속도로 (Highway) 스타일
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }], // 고속도로 색상
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }], // 고속도로 경계선 색상
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }], // 고속도로 텍스트 색상
  },

  // 🔹 대중교통 (지하철, 버스 등) 스타일
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }], // 지하철 및 철도 색상
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }], // 대중교통 역 이름 색상
  },

  // 🔹 물(Water, 강/바다) 스타일
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }], // 바다, 강 색상
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }], // 물 이름 텍스트 색상
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }], // 물 이름 텍스트 테두리 색상
  },

  // 🔹 인공 구조물(빌딩, 건물 등) 색상
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }], // 건물 색상
  },
];
