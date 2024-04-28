import { FIRST_PAGE } from "../constants";

export function getPagesDiffToLeftBoundary(p: {
  leftestSibling: number;
  boundaryCount: number;
}) {
  const leftSideFirstPageWithBoundary = FIRST_PAGE + p.boundaryCount;
  return Math.max(0, p.leftestSibling - leftSideFirstPageWithBoundary);
}

export function getPagesDiffToRightBoundary(p: {
  rightestSibling: number;
  totalAmountPages: number;
  boundaryCount: number;
}) {
  const rightSideFirstPageWithBoundary = p.totalAmountPages - p.boundaryCount;
  return Math.max(0, rightSideFirstPageWithBoundary - p.rightestSibling);
}

export function getFirstAndLastArrayElements<T>(arr: T[]) {
  const { 0: firstElement, length, [length - 1]: lastElement } = arr;
  return [firstElement, lastElement];
}

export function getActivePageRangeWithSiblings({
  activePage,
  siblingCount,
  allPagesCount,
}: {
  activePage: number;
  siblingCount: number;
  allPagesCount: number;
}) {
  const startSibling = Math.max(FIRST_PAGE, activePage - siblingCount);
  const endSibling = Math.min(activePage + siblingCount, allPagesCount);
  return createRange([startSibling, endSibling]);
}

export function createRange(extremes: [number, number], extremesIncluded = true) {
  const [start, end] = extremes;

  if (start > end) return [];

  return extremesIncluded
    ? [...Array(end - start + 1)].map((_, i) => i + start)
    : [...Array(end - start - 1)].map((_, i) => i + start + 1);
}
