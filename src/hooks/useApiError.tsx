import React from "react";
// Components
import TextLayout from "src/components/layouts/TextLayout";
import { Button } from "@patternfly/react-core";
// Utils
import { apiErrorToJsXError } from "src/utils/utils";
// Redux toolkit
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";

const useApiError = () => {
  // #1 - Handle general API calls errors
  // See: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
  // - Errors array
  const [apiErrorsJsx, setApiErrorsJsx] = React.useState<JSX.Element[]>([]);

  // - Global error message (JSX wrapper to display the array above)
  const [errorGlobalMessage, setErrorGlobalMessage] =
    React.useState<JSX.Element>(<></>);

  // - Catch API errors and write them in the error's list ('apiErrors')
  const addApiError = (
    errorFromApiCall: FetchBaseQueryError | SerializedError | undefined,
    contextMessage: string,
    key: string
  ) => {
    if (errorFromApiCall !== undefined) {
      const jsxError = apiErrorToJsXError(
        errorFromApiCall,
        contextMessage,
        key
      );

      const errorJsx = [...apiErrorsJsx];
      errorJsx.push(jsxError);
      setApiErrorsJsx(errorJsx);
    }
  };

  // - Remove API errors
  const removeApiErrors = () => {
    setApiErrorsJsx([]);
  };

  // - Show API errors
  const ShowApiErrors = () => <>{errorGlobalMessage}</>;

  // - Keep 'errorGlobalMessage' data updated with recent changes (in 'apiErrorsJsx')
  React.useEffect(() => {
    setErrorGlobalMessage(
      <div style={{ alignSelf: "center", marginTop: "16px" }}>
        <TextLayout component="h3">An error has occurred</TextLayout>
        {apiErrorsJsx}
      </div>
    );
  }, [apiErrorsJsx]);

  // #2 - Handle API error data (when adding users)
  // Open a modal to display the error message when adding a user fails.
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
  };

  const errorModalActions = [
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
      Cancel
    </Button>,
  ];

  const addErrorOnAddUser = (error: FetchBaseQueryError | SerializedError) => {
    if ("error" in error) {
      setErrorTitle("IPA error");
      if (error.data !== undefined) {
        setErrorMessage(error.error);
      }
    }
    setIsModalErrorOpen(true);
  };

  const ErrorOnAddUserModal = () => (
    <>
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );

  return {
    ShowApiErrors,
    addApiError,
    removeApiErrors,
    addErrorOnAddUser,
    ErrorOnAddUserModal,
  };
};

export default useApiError;
