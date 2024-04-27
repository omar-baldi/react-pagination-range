import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_BOUNDARY_COUNT,
  DEFAULT_SIBLING_COUNT,
  FIRST_PAGE,
  THRESHOLD_PAGE_COUNT,
} from "../constants";
import {
  getActivePageRangeWithSiblings,
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

export const usePaginationRange = ({
  totalAmountElements,
  //!NOTE: to refactor hook for boundaryCount = 0 -> we do not render the leftest and rightest page in the range
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

  const range = useMemo(() => {
    const activePageRangeWithSiblings = getActivePageRangeWithSiblings({
      activePage,
      siblingCount,
      allPages,
    });

    const [leftestSibling, rightestSibling] = getFirstAndLastArrayElements(
      activePageRangeWithSiblings
    );

    const pagesDiffLeft = getPagesDiffToLeftBoundary({
      boundaryCount,
      leftestSibling,
    });

    const pagesDiffRight = getPagesDiffToRightBoundary({
      boundaryCount,
      rightestSibling,
      totalAmountPages: allPages.length,
    });

    if (
      allPages.length - (activePageRangeWithSiblings.length + boundaryCount + 1) <=
      THRESHOLD_PAGE_COUNT
    ) {
      return allPages;
    }

    const shouldAddBeforeDots = pagesDiffLeft >= THRESHOLD_PAGE_COUNT;
    const shouldAddAfterDots = pagesDiffRight >= THRESHOLD_PAGE_COUNT;

    return [
      ...(shouldAddBeforeDots
        ? [...allPages.slice(0, boundaryCount), "..."]
        : allPages.slice(0, activePageRangeWithSiblings.length + boundaryCount + 1)),
      ...(shouldAddBeforeDots && shouldAddAfterDots ? activePageRangeWithSiblings : []),
      ...(shouldAddAfterDots
        ? ["...", ...allPages.slice(-boundaryCount)]
        : allPages.slice(-(activePageRangeWithSiblings.length + boundaryCount + 1))),
    ];
  }, [activePage, allPages, siblingCount, boundaryCount]);

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
