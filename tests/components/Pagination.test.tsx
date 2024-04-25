/* eslint-disable */
import Pagination from "@/components/Pagination";
import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/react";

function extractPagesButtonElements(wrapper: RenderResult, pagesArr: number[]) {
  return pagesArr.map((page) => wrapper.queryByTestId(`button-page button-page-${page}`));
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
});
