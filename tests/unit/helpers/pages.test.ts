import {
  createRange,
  getActivePageRangeWithSiblings,
  getPagesDiffToLeftBoundary,
} from "@/helpers/pages";

describe("pages", () => {
  describe("getPagesDiffToLeftBoundary", () => {
    it.each([
      [{ leftestSibling: 5, boundaryCount: 1, expectedDiff: 3 }],
      [{ leftestSibling: 1, boundaryCount: 1, expectedDiff: 0 }],
      [{ leftestSibling: 10, boundaryCount: 3, expectedDiff: 6 }],
      [{ leftestSibling: 5, boundaryCount: 3, expectedDiff: 1 }],
    ])(
      "should return correct amount between first page and leftest sibling of active page",
      (params) => {
        const { expectedDiff, ...config } = params;
        const pagesDiff = getPagesDiffToLeftBoundary(config);
        expect(pagesDiff).toBe(expectedDiff);
      }
    );
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

  describe("createRange", () => {
    it.each([
      [
        {
          extremes: [1, 10],
          includeExtremes: true,
          expectedRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
      ],
      [
        {
          extremes: [1, 10],
          includeExtremes: false,
          expectedRange: [2, 3, 4, 5, 6, 7, 8, 9],
        },
      ],
      [
        {
          extremes: [5, 12],
          includeExtremes: true,
          expectedRange: [5, 6, 7, 8, 9, 10, 11, 12],
        },
      ],
      [
        {
          extremes: [5, 12],
          includeExtremes: false,
          expectedRange: [6, 7, 8, 9, 10, 11],
        },
      ],
    ])("should return correct number range", (params) => {
      const { extremes, includeExtremes, expectedRange } = params;
      const range = createRange(extremes as [number, number], includeExtremes);
      expect(range).toEqual(expectedRange);
    });
  });
});
