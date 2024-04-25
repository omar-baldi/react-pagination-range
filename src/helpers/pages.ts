import { FIRST_PAGE } from "../constants";

export function getPagesDiffToLeftBoundary(p: {
  leftestSibling: number;
  boundaryCount: number;
}) {
  const leftSideFirstPageWithBoundary = FIRST_PAGE + p.boundaryCount;
  return p.leftestSibling - leftSideFirstPageWithBoundary;
}

export function getPagesDiffToRightBoundary(p: {
  rightestSibling: number;
  totalAmountPages: number;
  boundaryCount: number;
}) {
  const rightSideFirstPageWithBoundary = p.totalAmountPages - p.boundaryCount;
  return rightSideFirstPageWithBoundary - p.rightestSibling;
}

export function getFirstAndLastArrayElements<T>(arr: T[]) {
  const { 0: firstElement, length, [length - 1]: lastElement } = arr;
  return [firstElement, lastElement];
}
