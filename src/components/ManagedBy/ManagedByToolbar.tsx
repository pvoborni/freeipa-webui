import React from "react";
// PatternFly
import { Pagination, ToolbarItemVariant, Text } from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";

// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
import TextLayout from "src/components/layouts/TextLayout";
import ToolbarLayout, { ToolbarItemAlignment } from "../layouts/ToolbarLayout";

interface ToolbarProps {
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

  // buttons
  onRefreshClick: () => void;
  onAddClick: () => void;
  onDeleteClick: () => void;
  isDeleteButtonDisabled: boolean;
}

const ManagedByToolbar = (props: ToolbarProps) => {

  // - Page setters
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

  // 'Hosts' toolbar elements data
  const hostsToolbarData = {
    refreshButton: {
      id: "button-refresh",
      onClickHandler: props.onRefreshClick,
    },
    deleteButton: {
      id: "button-delete",
      isDisabledHandler: props.isDeleteButtonDisabled,
      onClickHandler: props.onDeleteClick,
    },
    addButton: {
      id: "button-add",
      onClickHandler: props.onAddClick,
    },
    separatorId: "separator",
    helpIcon: {
      id: "help-icon",
      // href: TDB
    },
    paginationId: "pagination",
  };

  const toolbarFields = [
    {
      id: "button-refresh",
      key: 0,
      element: (
        <SecondaryButton
          name="refresh"
          onClickHandler={props.onRefreshClick}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      id: hostsToolbarData.deleteButton.id,
      key: 1,
      element: (
        <SecondaryButton
          name="remove"
          isDisabled={hostsToolbarData.deleteButton.isDisabledHandler}
          onClickHandler={hostsToolbarData.deleteButton.onClickHandler}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      id: hostsToolbarData.addButton.id,
      key: 2,
      element: (
        <SecondaryButton
          name="add"
          onClickHandler={hostsToolbarData.addButton.onClickHandler}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      id: hostsToolbarData.separatorId,
      key: 3,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      id: hostsToolbarData.helpIcon.id,
      key: 7,
      element: (
        <TextLayout component="p">
          <OutlinedQuestionCircleIcon className="pf-u-primary-color-100 pf-u-mr-sm" />
          <Text component="a" isVisitedLink>
            Help
          </Text>
        </TextLayout>
      ),
    },
    {
      id: hostsToolbarData.paginationId,
      key: 8,
      element: (
        <Pagination
          itemCount={props.itemCount}
          perPage={props.perPage}
          page={props.page}
          onSetPage={onSetPage}
          widgetId="pagination-options-menu-top"
          onPerPageSelect={onPerPageSelect}
          isCompact
        />
      ),
      toolbarItemAlignment: { default: "alignRight" } as ToolbarItemAlignment,
    },
  ];

  // Render component
  return <ToolbarLayout isSticky={false} toolbarItems={toolbarFields} />;
};

export default ManagedByToolbar;
