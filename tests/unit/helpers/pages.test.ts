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
    it.each([
      [{ activePage: 6, siblingCount: 1, allPagesCount: 20, expectedRange: [5, 6, 7] }],
      [{ activePage: 1, siblingCount: 1, allPagesCount: 20, expectedRange: [1, 2] }],
      [{ activePage: 20, siblingCount: 1, allPagesCount: 20, expectedRange: [19, 20] }],
      [
        {
          activePage: 6,
          siblingCount: 3,
          allPagesCount: 20,
          expectedRange: [3, 4, 5, 6, 7, 8, 9],
        },
      ],
    ])(
      "should return correct range given current active page and siblingCount",
      (params) => {
        const { expectedRange, ...config } = params;
        const range = getActivePageRangeWithSiblings(config);
        expect(range).toEqual(expectedRange);
      }
    );
  });
});
