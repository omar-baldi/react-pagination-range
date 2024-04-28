import {
  getActivePageRangeWithSiblings,
  getPagesDiffToLeftBoundary,
} from "@/helpers/pages";

describe("pages", () => {
  describe("getPagesDiffToLeftBoundary", () => {
    it("should return correct amount of pages in between", () => {
      const pagesDiff = getPagesDiffToLeftBoundary({
        leftestSibling: 5,
        boundaryCount: 1,
      });

      expect(pagesDiff).toBe(3);
    });
  });

  describe("getActivePageRangeWithSiblings", () => {
    it("should return array of numbers containing active page with siblings", () => {
      const range = getActivePageRangeWithSiblings({
        activePage: 6,
        siblingCount: 1,
        allPagesCount: 20,
      });

      expect(range).toEqual([5, 6, 7]);
    });
  });
});
