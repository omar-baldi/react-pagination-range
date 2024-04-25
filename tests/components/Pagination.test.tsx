/* eslint-disable */
import Pagination from "@/components/Pagination";
import { FIRST_PAGE } from "@/constants";
import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/react";

function extractPagesButtonElements(wrapper: RenderResult, pagesArr: number[]) {
  return pagesArr.map((page) => wrapper.queryByTestId(`button-page button-page-${page}`));
}

function simulatePageClick(wrapper: RenderResult, page: number) {
  const firstPageButton = wrapper.getByTestId(`button-page-${page}`, {
    exact: false,
  });

  fireEvent.click(firstPageButton);
}

describe("Pagination", () => {
  it("should render correct elements in the view", () => {
    const wrapper = render(
      <Pagination totalAmountElements={20} siblingCount={1} initialPage={6} />
    );

    const buttonPages = extractPagesButtonElements(wrapper, [1, 5, 6, 7, 20]);
    const dotsElements = wrapper.queryAllByTestId("dots");
    buttonPages.forEach((buttonPage) => expect(buttonPage).not.toBeNull());
    expect(dotsElements.length).toBe(2);
  });

  it("should update elements rendered when navigating to next page on button click", () => {
    const wrapper = render(
      <Pagination totalAmountElements={20} siblingCount={1} initialPage={6} />
    );

    const nextPageButton = wrapper.getByTestId("next-page-button");
    fireEvent.click(nextPageButton);

    const buttonPages = extractPagesButtonElements(wrapper, [1, 6, 7, 8, 20]);
    const dotsElements = wrapper.queryAllByTestId("dots");
    buttonPages.forEach((buttonPage) => expect(buttonPage).not.toBeNull());
    expect(dotsElements.length).toBe(2);
  });

  describe("When clicking on the first page button", () => {
    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(
        <Pagination totalAmountElements={20} siblingCount={1} initialPage={6} />
      );

      simulatePageClick(wrapper, FIRST_PAGE);
    });

    it("should update elements rendered in the DOM", () => {
      const buttonPages = extractPagesButtonElements(wrapper, [1, 2, 3, 4, 5, 20]);
      const dotsElements = wrapper.queryAllByTestId("dots");
      buttonPages.forEach((buttonPage) => expect(buttonPage).not.toBeNull());
      expect(dotsElements.length).toBe(1);
    });

    it("should button be disabled", () => {
      const prevPageButton = wrapper.getByTestId("prev-page-button");
      expect(prevPageButton).toBeDisabled();
    });
  });

  describe("When clicking on the last page button", () => {
    let wrapper: RenderResult;

    beforeEach(() => {
      const totalAmountElements = 20;
      wrapper = render(
        <Pagination
          totalAmountElements={totalAmountElements}
          siblingCount={1}
          initialPage={6}
        />
      );

      simulatePageClick(wrapper, totalAmountElements);
    });

    it("should update elements rendered in the DOM", () => {
      const buttonPages = extractPagesButtonElements(wrapper, [1, 16, 17, 18, 19, 20]);
      const dotsElements = wrapper.queryAllByTestId("dots");
      buttonPages.forEach((buttonPage) => expect(buttonPage).not.toBeNull());
      expect(dotsElements.length).toBe(1);
    });

    it("should button be disabled", () => {
      const nextPageButton = wrapper.getByTestId("next-page-button");
      expect(nextPageButton).toBeDisabled();
    });
  });
});
