/* eslint-disable */
import { useMemo, useState } from "react";
import "./App.css";

const totalAmountElements = 6;

function App() {
  const [activePage] = useState<number>(2);

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

    return before.length <= 3 && after.length <= 3
      ? elementsRange
      : [
          ...new Set([
            ...(before.length <= 3 ? elementsRange.slice(0, 3) : [1, "..."]),
            ...current,
            ...(after.length <= 3 ? elementsRange.slice(-3) : ["...", totalAmountPages]),
          ]),
        ];
  }

  const r = getPaginationRange();

  return <>{r}</>;
}

export default App;
