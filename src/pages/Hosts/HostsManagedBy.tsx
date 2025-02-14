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
// Modals
import ManagedByAddModal from "src/components/ManagedBy/ManagedByAddModal";
import ManagedByDeleteModal from "src/components/ManagedBy/ManagedByDeleteModal";

interface PropsToHostsManagedBy {
  host: Host;
}

const HostsManagedBy = (props: PropsToHostsManagedBy) => {
  // List of currents elements on the list (Dummy data)
  const [hostsList, setHostsList] = useState<Host[]>([props.host]);

  const updateHostsList = (newHostsList: Host[]) => {
    setHostsList(newHostsList);
  };

  // Retrieve available hosts data from Redux
  let availableHostsData = useAppSelector((state) => state.hosts.hostsList);

  // Alter the available options list to keep the state of the recently added / removed items
  const updateAvailableHostsList = (newAvOptionsList: unknown[]) => {
    availableHostsData = newAvOptionsList as Host[];
  };

  // Filter functions to compare the available data with the data that
  //  the host is already member of. This is done to prevent duplicates
  //  (e.g: adding the same element twice).
  const filterHostsData = () => {
    // Host groups
    return availableHostsData.filter((item) => {
      return !hostsList.some((itm) => {
        return item.hostName === itm.hostName;
      });
    });
  };

  // Available data to be added as member of
  const hostsFilteredData: Host[] = filterHostsData();

  // State that determines whether the row tables are displayed nor not
  // - This helps with the reload state
  const [showTableRows, setShowTableRows] = useState(false);

  // -- Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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

  // Member groups displayed on the first page
  const [shownHostsList, setShownHostsList] = useState(
    hostsList.slice(0, perPage)
  );

  // Pages setters (to manage pagination as an event)
  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    setShownHostsList(hostsList.slice(startIdx, endIdx));
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    setShownHostsList(hostsList.slice(startIdx, endIdx));
  };

  // Page setters passed as props
  const changeSetPage = (
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    setShownHostsList(hostsList.slice(startIdx, endIdx));
  };

  const changePerPageSelect = (
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    setShownHostsList(hostsList.slice(startIdx, endIdx));
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
      setShownHostsList(hostsList.slice(0, perPage));
      setShowTableRows(true);
    }, 1000);
  }, [hostsList]);

  // Data wrappers
  // - ManagedByToolbar
  const toolbarPageData = {
    page,
    changeSetPage,
    perPage,
    changePerPageSelect,
  };

  const toolbarButtonData = {
    onClickAddHandler,
    onClickDeleteHandler,
    isDeleteButtonDisabled,
  };

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
              pageRepo={hostsList}
              shownItems={shownHostsList}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
            />
            <ManagedByTable
              list={hostsList}
              tableName="Hosts"
              updateList={updateHostsList}
              showTableRows={showTableRows}
              updateElementsSelected={updateHostsSelected}
              buttonData={tableButtonData}
            />
          </Tab>
        </Tabs>
        <Pagination
          perPageComponent="button"
          className="pf-u-pb-0 pf-u-pr-md"
          itemCount={hostsList.length}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
      </PageSection>
      <>
        {showAddModal && (
          <ManagedByAddModal
            modalData={addModalData}
            availableData={hostsFilteredData}
            groupRepository={hostsList}
            updateGroupRepository={updateHostsList}
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
            updateGroupRepository={updateHostsList}
            buttonData={deleteButtonData}
          />
        )}
      </>
    </Page>
  );
};

export default HostsManagedBy;
