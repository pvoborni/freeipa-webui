import React, { useEffect, useState } from "react";
// PatternFly
import {
  Badge,
  Page,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Data type
import { Host } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppSelector } from "src/store/hooks";
// Others
import ManagedByTable from "src/components/ManagedBy/ManagedByTable";
import ManagedByToolbar from "src/components/ManagedBy/ManagedByToolbar";
import ComplexPagination from "src/components/tables/ComplexPagination";
// Modals
import ManagedByAddModal from "src/components/ManagedBy/ManagedByAddModal";
import ManagedByDeleteModal from "src/components/ManagedBy/ManagedByDeleteModal";

interface PropsToHostsManagedBy {
  host: Host;
}

const HostsManagedBy = (props: PropsToHostsManagedBy) => {
  // List of currents elements on the list (Dummy data)
  const [hostsList, setHostsList] = useState<Host[]>([props.host]);

  // -- Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const startIdx = (page - 1) * perPage
  const endIdx = startIdx + perPage - 1
  const shownHosts = hostsList.slice(startIdx, endIdx);


  // Some data is updated when any group list is altered
  //  - The whole list itself
  //  - The slice of data to show (considering the pagination)
  //  - Number of items for a specific list
  const updateGroupRepository = (newHostsList: Host[]) => {
    setHostsList(newHostsList);
  };

  // Retrieve available hosts data from Redux
  let availableHostsData = useAppSelector((state) => state.hosts.hostsList);

  // Alter the available options list to keep the state of the recently added / removed items
  const updateAvailableHostsList = (newAvOptionsList: unknown[]) => {
    availableHostsData = newAvOptionsList as Host[];
  };

  // Filter functions to compare the available data with the data that
  //  the host is already managed by. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterHostsData = () => {
    // Host groups
    return availableHostsData.filter((item) => {
      return !hostsList.some((itm) => {
        return item.hostName === itm.hostName;
      });
    });
  };

  // Available data to be added as managed by
  const hostsFilteredData: Host[] = filterHostsData();

  // State that determines whether the row tables are displayed nor not
  // - This helps with the reload state
  const [showTableRows, setShowTableRows] = useState(false);


  // -- Name of the hosts selected on the table (to remove)
  const [hostsSelected, setHostsSelected] = useState<string[]>([]);

  const updateHostsSelected = (hosts: string[]) => {
    setHostsSelected(hosts);
  };

  // -- 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (updatedDeleteButton: boolean) => {
    setIsDeleteButtonDisabled(updatedDeleteButton);
  };

  // If some entries have been deleted, restore the 'groupsNamesSelected' list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (option: boolean) => {
    setIsDeletion(option);
  };

  // -- Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onClickAddHandler = () => {
    setShowAddModal(true);
  };
  const onModalToggle = () => {
    setShowAddModal(!showAddModal);
  };

  const onClickDeleteHandler = () => {
    setShowDeleteModal(true);
  };

  const onModalDeleteToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // Reloads the table everytime any of the group lists are updated
  useEffect(() => {
    setPage(1);
    if (showTableRows) setShowTableRows(false);
    setTimeout(() => {
      setShowTableRows(true);
    }, 1000);
  }, [hostsList]);

  // Data wrappers

  // - ManagedByTable
  const tableButtonData = {
    isDeletion,
    updateIsDeletion,
    changeIsDeleteButtonDisabled: updateIsDeleteButtonDisabled,
  };

  // - MemberOfAddModal
  const addModalData = {
    showModal: showAddModal,
    handleModalToggle: onModalToggle,
  };

  const tabData = {
    tabName: "Hosts",
    elementName: props.host.hostName,
  };

  // - MemberOfDeleteModal
  const deleteModalData = {
    showModal: showDeleteModal,
    handleModalToggle: onModalDeleteToggle,
  };

  const deleteButtonData = {
    changeIsDeleteButtonDisabled: updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const deleteTabData = {
    tabName: "Hosts",
    elementName: props.host.hostName,
  };

  // Render component
  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-u-m-lg"
      >
        <Tabs activeKey={0} isBox={false}>
          <Tab
            eventKey={0}
            name="managedby_host"
            title={
              <TabTitleText>
                Hosts{" "}
                <Badge key={0} isRead>
                  {hostsList.length}
                </Badge>
              </TabTitleText>
            }
          >
            <ManagedByToolbar
              itemCount={hostsList.length}
              page={page}
              onSetPage={setPage}
              perPage={perPage}
              onPerPageSelect={setPerPage}

              onRefreshClick={()=> null}
              onAddClick={onClickAddHandler}
              onDeleteClick={onClickDeleteHandler}
              isDeleteButtonDisabled={isDeleteButtonDisabled}
            />
            <ManagedByTable
              list={shownHosts}
              tableName="Hosts"
              showTableRows={showTableRows}
              updateElementsSelected={updateHostsSelected}
              buttonData={tableButtonData}
            />
          </Tab>
        </Tabs>
        <ComplexPagination
          itemCount={hostsList.length}
          page={page}
          onSetPage={setPage}
          perPage={perPage}
          onPerPageSelect={setPerPage}
        />
      </PageSection>
      <>
        {showAddModal && (
          <ManagedByAddModal
            modalData={addModalData}
            availableData={hostsFilteredData}
            groupRepository={hostsList}
            updateGroupRepository={updateGroupRepository}
            updateAvOptionsList={updateAvailableHostsList}
            tabData={tabData}
          />
        )}
        {showDeleteModal && hostsSelected.length !== 0 && (
          <ManagedByDeleteModal
            modalData={deleteModalData}
            tabData={deleteTabData}
            groupNamesToDelete={hostsSelected}
            groupRepository={hostsList}
            updateGroupRepository={updateGroupRepository}
            buttonData={deleteButtonData}
          />
        )}
      </>
    </Page>
  );
};

export default HostsManagedBy;
