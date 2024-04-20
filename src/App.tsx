/* eslint-disable */
import { useMemo, useState } from "react";
import "./App.css";

const totalAmountElements = 4;
const defaultInitialPage = 2;

function App() {
  const [activePage, setActivePage] = useState<number>(defaultInitialPage);

  const elementsRange = useMemo(() => {
    return [...Array(totalAmountElements)].map((_, i) => i + 1);
  }, []);

  function getRanges(activePage: number, totalAmountPages: number) {
    return {
      before: elementsRange.slice(0, activePage - 1),
      current: [activePage],
      after: elementsRange.slice(Math.min(activePage, totalAmountPages)),
    };
  }

  function getPaginationRange() {
    const totalAmountPages = elementsRange.length;
    const ranges = getRanges(activePage, totalAmountPages);
    const { before, current, after } = ranges;

    /**
     * Making sure to return the whole array range
     * if for both sides from either the first page/last page
     * to the active page there are less than 2 elements.
     * Meaning that there's no need to render the 3 dots
     * if there is only one element in between.
     */
    if (before.length <= 2 && after.length <= 2) {
      return elementsRange;
    }

    const shouldAddBeforeDots = before.length <= 2;
    const shouldAddAfterDots = after.length <= 2;

    return [
      ...(shouldAddBeforeDots ? elementsRange.slice(0, 3) : [1, "..."]),
      ...(shouldAddBeforeDots && shouldAddAfterDots ? current : []),
      ...(shouldAddAfterDots ? elementsRange.slice(-3) : ["...", totalAmountPages]),
    ];
  }

  const r = getPaginationRange();

  return (
    <>
      activePage: {activePage}
      <br />
      paginationRange: {r}
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          setActivePage((prevActivePage) => Math.max(0, prevActivePage - 1));
        }}
      >
        Decrement page
      </button>
      <button
        onClick={() => {
          setActivePage((prevActivePage) =>
            Math.min(prevActivePage + 1, elementsRange.length)
          );
        }}
      >
        Increment page
      </button>
    </>
  );
}

export default App;
