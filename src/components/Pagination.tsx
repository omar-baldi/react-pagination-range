/* eslint-disable */
import React from "react";
import { FIRST_PAGE } from "../constants";
import {
  type PaginationRangeConfigOptions,
  usePaginationRange,
} from "../hooks/usePaginationRange";

type Props = {
  variant?: "BASIC" | "OUTLINED" | "ROUNDED";
  size?: "SMALL" | "MEDIUM" | "LARGE";
  showFirstButton?: boolean;
  showLastButton?: boolean;
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
} & PaginationRangeConfigOptions;

function separateProps(props: Props) {
  const {
    variant,
    size,
    showFirstButton,
    showLastButton,
    hidePrevButton,
    hideNextButton,
    ...rangeConfig
  } = props;

  return {
    style: {
      variant,
      size,
    },
    navigation: {
      showFirstButton,
      showLastButton,
      hidePrevButton,
      hideNextButton,
    },
    rangeHookConfig: rangeConfig,
  };
}

export default function Pagination(props: Props) {
  const separatedProps = separateProps(props);
  const { rangeHookConfig, navigation } = separatedProps;

  const {
    range,
    activePage,
    decrementPage,
    incrementPage,
    goToFirstPage,
    goToLastPage,
    goToSpecificPage,
  } = usePaginationRange(rangeHookConfig);

  const pagesElements = range.map((page, index) => {
    const isCurrentPageSelected = activePage === page;
    const key = `page-${page}-#${index}`;

    return (
      <React.Fragment key={key}>
        {typeof page === "number" ? (
          <button
            data-testid={`button-page button-page-${page}`}
            onClick={() => goToSpecificPage(page)}
            style={{
              margin: "0 0.5rem",
              backgroundColor: isCurrentPageSelected ? "grey" : "initial",
            }}
          >
            {page}
          </button>
        ) : (
          <div data-testid="dots">{page}</div>
        )}
      </React.Fragment>
    );
  });

  const isPrevButtonDisabled = activePage === FIRST_PAGE;
  const isNextButtonDisabled = activePage === rangeHookConfig.totalAmountElements;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {navigation.showFirstButton && (
            <button onClick={goToFirstPage}>First page</button>
          )}
          {!navigation.hidePrevButton && (
            <button
              data-testid="prev-page-button"
              disabled={isPrevButtonDisabled}
              onClick={decrementPage}
            >
              Prev
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>{pagesElements}</div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!navigation.hideNextButton && (
            <button
              data-testid="next-page-button"
              disabled={isNextButtonDisabled}
              onClick={incrementPage}
            >
              Next
            </button>
          )}
          {navigation.showLastButton && <button onClick={goToLastPage}>Last page</button>}
        </div>
      </div>
    </>
  );
}
