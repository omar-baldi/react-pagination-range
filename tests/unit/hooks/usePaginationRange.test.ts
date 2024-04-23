import { usePaginationRange } from "@/hooks/usePaginationRange";
import { act, renderHook } from "@testing-library/react";

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

  describe("When incrementing the page", () => {
    it("should update active page and range if page is within range", () => {
      const { result } = renderHook(() =>
        usePaginationRange({
          totalAmountElements: 20,
          initialPage: 10,
          siblingCount: 1,
        })
      );

      expect(result.current.activePage).toBe(10);
      expect(result.current.range).toEqual([1, "...", 9, 10, 11, "...", 20]);
      act(() => result.current.incrementPage());
      expect(result.current.activePage).toBe(11);
      expect(result.current.range).toEqual([1, "...", 10, 11, 12, "...", 20]);
    });

    it("should not update active page and range when being at the last page", () => {
      const { result } = renderHook(() =>
        usePaginationRange({
          totalAmountElements: 20,
          initialPage: 20,
          siblingCount: 1,
        })
      );

      expect(result.current.activePage).toBe(20);
      expect(result.current.range).toEqual([1, "...", 16, 17, 18, 19, 20]);
      act(() => result.current.incrementPage());
      expect(result.current.activePage).toBe(20);
      expect(result.current.range).toEqual([1, "...", 16, 17, 18, 19, 20]);
    });
  });

  describe("When decrementing the page", () => {
    it("should update active page and range if page is within range", () => {
      const { result } = renderHook(() =>
        usePaginationRange({
          totalAmountElements: 20,
          initialPage: 10,
          siblingCount: 1,
        })
      );

      expect(result.current.activePage).toBe(10);
      expect(result.current.range).toEqual([1, "...", 9, 10, 11, "...", 20]);
      act(() => result.current.decrementPage());
      expect(result.current.activePage).toBe(9);
      expect(result.current.range).toEqual([1, "...", 8, 9, 10, "...", 20]);
    });

    it("should not update active page and range when being at the first page", () => {
      const { result } = renderHook(() =>
        usePaginationRange({
          totalAmountElements: 20,
          siblingCount: 1,
        })
      );

      expect(result.current.activePage).toBe(1);
      expect(result.current.range).toEqual([1, 2, 3, 4, 5, "...", 20]);
      act(() => result.current.decrementPage());
      expect(result.current.activePage).toBe(1);
      expect(result.current.range).toEqual([1, 2, 3, 4, 5, "...", 20]);
    });
  });
});
