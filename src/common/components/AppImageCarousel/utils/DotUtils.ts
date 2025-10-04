export function getDotStyle({
  idx,
  curPage,
  maxPage,
}: {
  idx: number;
  curPage: number;
  maxPage: number;
}) {
  // dot 기본 크기/투명도
  let size = 3;
  let opacity = 0.2;

  if (idx === curPage) {
    size = 6; // 활성 dot은 더 큼
    opacity = 1.0; // 불투명
  } else if (Math.abs(curPage - idx) === 1) {
    size = 5;
    opacity = 0.7;
  } else if (Math.abs(curPage - idx) === 2) {
    size = 4;
    opacity = 0.5;
  }

  return { size, opacity };
}
