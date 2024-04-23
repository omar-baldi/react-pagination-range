import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_BOUNDARY_COUNT, DEFAULT_SIBLING_COUNT, FIRST_PAGE } from "../constants";
import {
  getFirstAndLastArrayElements,
  getPagesDiffToLeftBoundary,
  getPagesDiffToRightBoundary,
} from "../helpers/pages";

export type PaginationRangeConfigOptions = {
  totalAmountElements: number;
  siblingCount?: number;
  boundaryCount?: number;
  initialPage?: number;
};

//!NOTE: to refactor hook for boundaryCount = 0 -> we do not render the leftest and rightest page in the range
export const usePaginationRange = ({
  totalAmountElements,
  siblingCount = DEFAULT_SIBLING_COUNT,
  boundaryCount = DEFAULT_BOUNDARY_COUNT,
  initialPage = FIRST_PAGE,
}: PaginationRangeConfigOptions) => {
  const [activePage, setActivePage] = useState<number>(initialPage);

  useEffect(() => {
    setActivePage((prevActivePage) =>
      prevActivePage > totalAmountElements ? FIRST_PAGE : prevActivePage
    );
  }, [totalAmountElements]);

  const allPages = useMemo(() => {
    return [...Array(totalAmountElements)].map((_, i) => i + 1);
  }, [totalAmountElements]);

  const activePageRangeWithSiblings = useMemo<number[]>(() => {
    const startIndex = Math.max(0, activePage - siblingCount - 1);
    const endIndex = Math.min(activePage + siblingCount, allPages.length);
    return allPages.slice(startIndex, endIndex);
  }, [allPages, activePage, siblingCount]);

  const range = useMemo(() => {
    const siblings = getFirstAndLastArrayElements(activePageRangeWithSiblings);
    const [leftestSibling, rightestSibling] = siblings;

    const pagesDiffLeft = getPagesDiffToLeftBoundary({
      boundaryCount,
      leftestSibling,
    });

    const pagesDiffRight = getPagesDiffToRightBoundary({
      boundaryCount,
      rightestSibling,
      totalAmountPages: allPages.length,
    });

    if (pagesDiffLeft < 2 && pagesDiffRight < 2) {
      return allPages;
    }

    const activePageWithSiblingsLength = siblingCount * 2 + 1;
    const shouldAddBeforeDots = pagesDiffLeft >= 2;
    const shouldAddAfterDots = pagesDiffRight >= 2;

    return [
      ...(shouldAddBeforeDots
        ? [...allPages.slice(0, boundaryCount), "..."]
        : allPages.slice(0, activePageWithSiblingsLength + boundaryCount + 1)),
      ...(shouldAddBeforeDots && shouldAddAfterDots ? activePageRangeWithSiblings : []),
      ...(shouldAddAfterDots
        ? ["...", ...allPages.slice(-boundaryCount)]
        : allPages.slice(-(activePageWithSiblingsLength + boundaryCount + 1))),
    ];
  }, [activePageRangeWithSiblings, allPages, siblingCount, boundaryCount]);

  const decrementPage = useCallback(() => {
    setActivePage((prevActivePage) => {
      return Math.max(FIRST_PAGE, prevActivePage - 1);
    });
  }, []);

  const goToSpecificPage = useCallback(
    (newPage: number) => {
      setActivePage((prevActivePage) => {
        if (!allPages.includes(newPage)) {
          console.warn("Current page not in valid pagination range");
          return prevActivePage;
        }

        return newPage;
      });
    },
    [allPages]
  );

  const goToFirstPage = useCallback(() => {
    setActivePage(FIRST_PAGE);
  }, []);

  const goToLastPage = useCallback(() => {
    setActivePage(allPages.length);
  }, [allPages]);

  const incrementPage = useCallback(() => {
    setActivePage((prevActivePage) => {
      return Math.min(prevActivePage + 1, allPages.length);
    });
  }, [allPages]);

  return {
    range,
    activePage,
    goToSpecificPage,
    goToFirstPage,
    goToLastPage,
    decrementPage,
    incrementPage,
  };
};
