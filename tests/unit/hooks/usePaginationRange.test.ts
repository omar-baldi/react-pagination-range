import { usePaginationRange } from "@/hooks/usePaginationRange";
import { renderHook } from "@testing-library/react";

describe("usePaginationRange", () => {
  it("should custom hook be initialized with default values", () => {
    const { result } = renderHook(() =>
      usePaginationRange({
        totalAmountElements: 20,
        initialPage: 6,
        siblingCount: 1,
      })
    );

    const { activePage, range } = result.current;

    expect(activePage).toBe(6);
    expect(range).toEqual([1, "...", 5, 6, 7, "...", 20]);
  });
});
