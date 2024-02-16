import React, { useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import TableLayout from "src/components/layouts/TableLayout";

// Although tabs data types habe been already defined, it is not possible to access to all
//  its variables. Just the mandatory ones ('name' and 'description') are accessible at this point.
// To display all the possible data types for all the tabs (and not only the mandatory ones)
//   an extra interface 'MemberOfElement' will be defined. This will be assigned in the
//   'PropsToDeleteOnTable' interface instead of each type (UserGroup | Netgroup | Roles
//   | HBACRules | SudoRules).
export interface MemberOfElement {
  name?: string;
  gid?: string;
  status?: string;
  description: string;
}

// Interface for Column names
// All variables are defined as optional as it won't need to be explicitely defined when
//   generating the column names (on 'generateColumnNames()')
export interface ColumnNames {
  name?: string;
  gid?: string;
  status?: string;
  description?: string;
}

interface PropsToDeleteOnTable {
  itemsToDelete: MemberOfElement[];
  tableHeaders?: ColumnNames; // TODO: Make this prop mandatory when all tabs have been adapted to the C.L.
  tabName?: string; // TODO: Remove when all tabs have been adapted to the C.L.
}

const MemberOfDeletedGroupsTable = (props: PropsToDeleteOnTable) => {
  // Function to generate the column names
  // TODO: Remove when all tabs have been adapted to the C.L.
  const generateColumnNames = () => {
    switch (props.tabName) {
      case "User groups":
        return {
          name: "Role name",
          gid: "GID",
          description: "Description",
        } as ColumnNames;
      case "Netgroups":
        return {
          name: "Netgroup name",
          description: "Description",
        } as ColumnNames;
      case "Roles":
        return {
          name: "Role name",
          description: "Description",
        } as ColumnNames;
      case "HBAC rules":
        return {
          name: "Rule name",
          status: "Status",
          description: "Description",
        } as ColumnNames;
      case "Sudo rules":
        return {
          name: "Rule name",
          status: "Status",
          description: "Description",
        } as ColumnNames;
      default:
        return {};
    }
  };

  // TODO: Remove when all tabs have been adapted to the C.L.
  const [columnNames] = useState<ColumnNames>(generateColumnNames());

  const header = () => {
    console.log("props.tableHeaders: ", props.tableHeaders);
    if (props.tableHeaders) {
      return (
        <Tr>
          {props.tableHeaders.name && (
            <Th modifier="wrap">{props.tableHeaders.name}</Th>
          )}
          {props.tableHeaders.gid && (
            <Th modifier="wrap">{props.tableHeaders.gid}</Th>
          )}
          {props.tableHeaders.status && (
            <Th modifier="wrap">{props.tableHeaders.status}</Th>
          )}
          {props.tableHeaders.description && (
            <Th modifier="wrap">{props.tableHeaders.description}</Th>
          )}
        </Tr>
      );
    } else if (props.tabName) {
      // TODO: Remove when all tabs have been adapted to the C.L.
      return (
        <Tr>
          {columnNames.name && <Th modifier="wrap">{columnNames.name}</Th>}
          {columnNames.gid && <Th modifier="wrap">{columnNames.gid}</Th>}
          {columnNames.status && <Th modifier="wrap">{columnNames.status}</Th>}
          {columnNames.description && (
            <Th modifier="wrap">{columnNames.description}</Th>
          )}
        </Tr>
      );
    }
  };

  const body = props.itemsToDelete.map((group) => (
    <Tr key={"delete-items-table"} id={"delete-items-table"}>
      {group.name && <Td dataLabel={group.name}>{group.name}</Td>}
      {group.gid && <Td dataLabel={group.gid}>{group.gid}</Td>}
      {group.status && <Td dataLabel={group.status}>{group.status}</Td>}
      {group.description && (
        <Td dataLabel={group.description}>{group.description}</Td>
      )}
    </Tr>
  ));

  return (
    <TableLayout
      ariaLabel={"Remove groups table"}
      name="cn"
      variant={"compact"}
      hasBorders={true}
      tableId={"remove-groups-table"}
      isStickyHeader={true}
      tableHeader={header()}
      tableBody={body}
    />
  );
};

export default MemberOfDeletedGroupsTable;
