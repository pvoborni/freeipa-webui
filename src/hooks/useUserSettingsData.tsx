// RPC
import {
  Command,
  useGetObjectMetadataQuery,
  useGetUsersFullDataQuery,
} from "src/services/rpc";

import { Metadata } from "src/utils/datatypes/globalDataTypes";

type UserSettingsData = {
  isLoading: boolean;
  metadata: Metadata;
  userData?: Record<string, unknown>;
  pwPolicyData?: Record<string, unknown>;
  krbtPolicyData?: Record<string, unknown>;
  certData?: Record<string, unknown>;
};

const useUserSettingsData = (userId: string): UserSettingsData => {
  // [API call] Metadata
  const metadataQuery = useGetObjectMetadataQuery();
  const metadata = metadataQuery.data || {};
  const metadataLoading = metadataQuery.isLoading;

  // [API call] Users data
  const userShowCommand: Command = {
    method: "user_show",
    params: [userId, { all: true, rights: true }],
  };

  const pwpolicyShowCommand: Command = {
    method: "pwpolicy_show",
    params: [[], { user: userId[0], all: true, rights: true }],
  };

  const krbtpolicyShowCommand: Command = {
    method: "krbtpolicy_show",
    params: [userId, { all: true, rights: true }],
  };

  const certFindCommand: Command = {
    method: "cert_find",
    params: [[], { user: userId[0], sizelimit: 0, all: true }],
  };

  const batchPayload: Command[] = [
    userShowCommand,
    pwpolicyShowCommand,
    krbtpolicyShowCommand,
    certFindCommand,
  ];

  const batchQuery = useGetUsersFullDataQuery(batchPayload);
  const batchResponse = batchQuery.data || {};
  const isBatchLoading = batchQuery.isLoading;

  const userData = isBatchLoading ? null : batchResponse[0].result;
  const pwPolicyData = isBatchLoading ? null : batchResponse[1].result;
  const krbtPolicyData = isBatchLoading ? null : batchResponse[2].result;
  const certData = isBatchLoading ? null : batchResponse[3].result;

  return {
    isLoading: metadataLoading || isBatchLoading,
    metadata,
    userData,
    pwPolicyData,
    krbtPolicyData,
    certData,
  };
};

export default useUserSettingsData;
