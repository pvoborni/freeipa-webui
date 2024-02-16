import React from "react";
// PatternFly
import {
  TextContent,
  Text,
  TextVariants,
  Button,
  Modal,
  Form,
  FormGroup,
} from "@patternfly/react-core";
// Tables
import MemberOfDeletedGroupsTable, {
  ColumnNames,
  MemberOfElement,
} from "src/components/MemberOf/MemberOfDeletedGroupsTable";
// Data types
import { AvailableItems } from "./MemberOfAddModal";

interface PropsToDelete {
  showModal: boolean;
  onCloseModal: () => void;
  tabName: string;
  itemsToDelete: string[];
  updateItemsToDelete: (args: string[]) => void;
  itemsToDeleteFullInfo: MemberOfElement[];
  groupRepository: AvailableItems[];
  onDelete: (items: string[]) => void;
  tableHeaders: ColumnNames;
}

const MemberOfDeleteModal = (props: PropsToDelete) => {
  const onDeleteGroups = () => {
    props.onDelete(props.itemsToDelete);
    props.updateItemsToDelete([]);
    props.onCloseModal();
  };

  const modalActionsDelete: JSX.Element[] = [
    <Button
      key="delete-groups"
      variant="danger"
      onClick={onDeleteGroups}
      form="active-users-remove-groups-modal"
    >
      Delete
    </Button>,
    <Button
      key="cancel-remove-group"
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <Modal
      variant={"medium"}
      position={"top"}
      positionOffset={"76px"}
      title={"Remove " + props.tabName}
      isOpen={props.showModal}
      onClose={props.onCloseModal}
      actions={modalActionsDelete}
      aria-label="Delete member modal"
    >
      <Form id={"is-member-of-delete-modal"}>
        <FormGroup key={"question-text"} fieldId={"question-text"}>
          <TextContent>
            <Text component={TextVariants.p}>
              Are you sure you want to remove the selected entries from the
              list?
            </Text>
          </TextContent>
        </FormGroup>
        <FormGroup key={"deleted-users-table"} fieldId={"deleted-users-table"}>
          <MemberOfDeletedGroupsTable
            itemsToDelete={props.itemsToDeleteFullInfo}
            tableHeaders={props.tableHeaders}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default MemberOfDeleteModal;
