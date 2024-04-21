import { useCallback, useMemo, useState } from "react";

const DEFAULT_SIBLING_COUNT = 0;
const DEFAULT_INITIAL_PAGE = 7;

//TODO: function renaming to be more descriptive
function getRanges(allPages: number[], activePage: number, siblingCount: number) {
  return {
    before: allPages.slice(0, Math.max(0, activePage - siblingCount - 1)),
    current: allPages.slice(
      Math.max(0, activePage - siblingCount - 1),
      Math.min(activePage + siblingCount, allPages.length)
    ),
    after: allPages.slice(Math.min(activePage + siblingCount, allPages.length)),
  };
}

export const usePaginationRange = ({
  totalAmountElements,
  siblingCount = DEFAULT_SIBLING_COUNT,
}: {
  totalAmountElements: number;
  siblingCount?: number;
}) => {
  const [activePage, setActivePage] = useState<number>(DEFAULT_INITIAL_PAGE);

  const allPages = useMemo(() => {
    return [...Array(totalAmountElements)].map((_, i) => i + 1);
  }, [totalAmountElements]);

  const range = useMemo(() => {
    const ranges = getRanges(allPages, activePage, siblingCount);
    const { before, current, after } = ranges;

    /**
     * Making sure to return the whole array range
     * if for both sides from either the first page/last page
     * to the active page there are less than 2 elements.
     * Meaning that there's no need to render the 3 dots
     * if there is only one element in between.
     */
    if (before.length <= 2 && after.length <= 2) {
      return allPages;
    }

    const activePageWithSiblingsLength = siblingCount * 2 + 1;
    const shouldAddBeforeDots = before.length > 2;
    const shouldAddAfterDots = after.length > 2;

    return [
      ...(shouldAddBeforeDots
        ? [1, "..."]
        : allPages.slice(0, activePageWithSiblingsLength + 2)),
      ...(shouldAddBeforeDots && shouldAddAfterDots ? current : []),
      ...(shouldAddAfterDots
        ? ["...", allPages.length]
        : allPages.slice(-(activePageWithSiblingsLength + 2))),
    ];
  }, [activePage, allPages, siblingCount]);

  const decrementPage = useCallback(() => {
    setActivePage((prevActivePage) => {
      return Math.max(0, prevActivePage - 1);
    });
  }, []);

  const incrementPage = useCallback(() => {
    setActivePage((prevActivePage) => {
      return Math.min(prevActivePage + 1, allPages.length);
    });
  }, [allPages]);

  return {
    range,
    activePage,
    decrementPage,
    incrementPage,
  };
};
