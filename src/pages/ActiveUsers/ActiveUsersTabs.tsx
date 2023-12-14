import React, { useState } from "react";
// PatternFly
import {
  Icon,
  Title,
  Page,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useLocation } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Other
import UserSettings from "../../components/UserSettings";
import UserMemberOf from "./UserMemberOf";
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useUserSettings } from "src/hooks/useUserSettingsData";
import LockIcon from "@patternfly/react-icons/dist/esm/icons/lock-icon";

const ActiveUsersTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  const userData: User = location.state as User;
  const uid = userData.uid;

  // Data loaded from DB
  const userSettingsData = useUserSettings(uid);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  // 'pagesVisited' array will contain the visited pages.
  // - Those will be passed to the BreadcrumbLayout component.
  const pagesVisited = [
    {
      name: "Active users",
      url: URL_PREFIX + "/active-users",
    },
  ];

  if (userSettingsData.isLoading) {
    return <DataSpinner />;
  }

  const disabled = userSettingsData.user.nsaccountlock;

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadcrumbLayout
          className="pf-v5-u-mb-md"
          userId={userData.uid}
          pagesVisited={pagesVisited}
        />
        <TextContent>
          <Title headingLevel="h1">
            <Text
              className="pf-v5-u-display-flex"
              title={disabled ? "User is disabled" : ""}
            >
              {userData.uid}
              {disabled ? (
                <Icon
                  className="pf-v5-u-ml-sm pf-v5-u-mt-sm"
                  status="info"
                  size="md"
                >
                  <LockIcon />
                </Icon>
              ) : (
                ""
              )}
            </Text>
          </Title>
        </TextContent>
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="light300"
          isBox
          className="pf-v5-u-ml-lg"
        >
          <Tab
            eventKey={0}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <UserSettings
              originalUser={userSettingsData.originalUser}
              user={userSettingsData.user}
              metadata={userSettingsData.metadata}
              pwPolicyData={userSettingsData.pwPolicyData}
              krbPolicyData={userSettingsData.krbtPolicyData}
              certData={userSettingsData.certData}
              onUserChange={userSettingsData.setUser}
              isDataLoading={userSettingsData.isFetching}
              onRefresh={userSettingsData.refetch}
              isModified={userSettingsData.modified}
              onResetValues={userSettingsData.resetValues}
              modifiedValues={userSettingsData.modifiedValues}
              radiusProxyData={userSettingsData.radiusServers}
              idpData={userSettingsData.idpServers}
              activeUsersList={userSettingsData.activeUsersList}
              from="active-users"
            />
          </Tab>
          <Tab
            eventKey={1}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <UserMemberOf user={userData} />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default ActiveUsersTabs;
