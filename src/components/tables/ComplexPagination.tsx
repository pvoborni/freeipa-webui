
import React from "react";

// PatternFly
import {
  Pagination,
  PaginationVariant,
} from "@patternfly/react-core";

interface ComplexPaginationProps {
  // pagination
  itemCount: number;
  page: number;
  onSetPage: (
    newPage: number,
  ) => void;
  perPage: number;
  onPerPageSelect: (
    newPerPage: number,
  ) => void;
}

const ComplexPagination = (props: ComplexPaginationProps) => {

  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
  ) => {
    props.onSetPage(newPage)
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
  ) => {
    props.onPerPageSelect(newPerPage)
  };

  return <Pagination
    perPageComponent="button"
    className="pf-u-pb-0 pf-u-pr-md"
    itemCount={props.itemCount}
    widgetId="pagination-options-menu-bottom"
    perPage={props.perPage}
    page={props.page}
    variant={PaginationVariant.bottom}
    onSetPage={onSetPage}
    onPerPageSelect={onPerPageSelect}
  />
}

export default ComplexPagination;
