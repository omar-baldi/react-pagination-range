import Pagination from "@/components/Pagination";
import { FIRST_PAGE } from "@/constants";
import { usePaginationRange } from "@/hooks/usePaginationRange";
import "@testing-library/jest-dom";
import { fireEvent, render, type RenderResult } from "@testing-library/react";
import { useState } from "react";

function extractPagesButtonElements(wrapper: RenderResult, pagesArr: number[]) {
  return pagesArr.map((page) => wrapper.queryByTestId(`button-page button-page-${page}`));
}

function simulatePageClick(wrapper: RenderResult, page: number) {
  const firstPageButton = wrapper.getByTestId(`button-page-${page}`, {
    exact: false,
  });

  fireEvent.click(firstPageButton);
}

function MockComponentWithPaginationRangeHook({
  initialTotalAmountElements,
  initialPage,
}: {
  initialTotalAmountElements: number;
  initialPage?: number;
}) {
  const [totalAmountElements, setTotalAmountElements] = useState<number>(
    initialTotalAmountElements
  );

  const { activePage, range } = usePaginationRange({
    totalAmountElements,
    initialPage,
  });

  return (
    <>
      <button
        data-testid="button-change-elements-amount"
        onClick={() => setTotalAmountElements(5)}
      >
        Change total amount elements
      </button>
      <div data-testid="current-range">{range}</div>;
      <div data-testid="active-page">{activePage}</div>;
    </>
  );
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

  describe("Navigation buttons rendering based on props", () => {
    it("should render both previous and next navigation buttons", () => {
      const wrapper = render(
        <Pagination totalAmountElements={20} siblingCount={1} initialPage={6} />
      );

      const prevPageButton = wrapper.getByTestId("prev-page-button");
      const nextPageButton = wrapper.getByTestId("next-page-button");

      expect(prevPageButton).toBeInTheDocument();
      expect(nextPageButton).toBeInTheDocument();
    });

    it("should not render previous navigation button if prop 'hidePrevButton' is set to true", () => {
      const wrapper = render(
        <Pagination
          totalAmountElements={20}
          siblingCount={1}
          initialPage={6}
          hidePrevButton
        />
      );

      const prevPageButton = wrapper.queryByTestId("prev-page-button");
      expect(prevPageButton).toBeNull();
    });

    it("should not render next navigation button if prop 'hideNextButton' is set to true", () => {
      const wrapper = render(
        <Pagination
          totalAmountElements={20}
          siblingCount={1}
          initialPage={6}
          hideNextButton
        />
      );

      const nextPageButton = wrapper.queryByTestId("next-page-button");
      expect(nextPageButton).toBeNull();
    });
  });

  it("should reset active page to first page if the previous active page is greater than new total amount of elements", () => {
    const wrapper = render(
      <MockComponentWithPaginationRangeHook
        initialTotalAmountElements={20}
        initialPage={18}
      />
    );

    expect(wrapper.queryByTestId("current-range")).toHaveTextContent("1...181920");
    expect(wrapper.queryByTestId("active-page")).toHaveTextContent("18");

    const btn = wrapper.getByTestId("button-change-elements-amount");
    fireEvent.click(btn);

    expect(wrapper.queryByTestId("current-range")).toHaveTextContent("12345");
    expect(wrapper.queryByTestId("active-page")).toHaveTextContent("1");
  });
});
