/* eslint-disable */
import React from "react";
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

export default function Pagination({
  variant,
  size,
  showFirstButton = false,
  showLastButton = false,
  hidePrevButton = false,
  hideNextButton = false,
  ...rangeConfig
}: Props) {
  const { range, activePage, decrementPage, incrementPage, goToFirstPage, goToLastPage } =
    usePaginationRange(rangeConfig);

  const pagesElements = range.map((page, index) => {
    const isCurrentPageSelected = activePage === page;
    const key = `page-${page}-#${index}`;

    return (
      <React.Fragment key={key}>
        {typeof page === "number" ? (
          <button
            style={{
              margin: "0 0.5rem",
              backgroundColor: isCurrentPageSelected ? "grey" : "initial",
            }}
          >
            {page}
          </button>
        ) : (
          <div>{page}</div>
        )}
      </React.Fragment>
    );
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {showFirstButton && <button onClick={goToFirstPage}>First page</button>}
        {!hidePrevButton && <button onClick={decrementPage}>Prev</button>}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>{pagesElements}</div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {!hideNextButton && <button onClick={incrementPage}>Next</button>}
        {showLastButton && <button onClick={goToLastPage}>Last page</button>}
      </div>
    </div>
  );
}
