import React from "react";
// PatternFly
import {
  DatePicker,
  InputGroup,
  TimePicker,
  isValidDate,
} from "@patternfly/react-core";
// Utils
import {
  pad2,
  parseFullDateStringToUTCFormat,
  toGeneralizedTime,
} from "src/utils/utils";
import {
  BasicType,
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";
import { ParamMetadata } from "src/utils/datatypes/globalDataTypes";
import { IPADate } from "../../utils/ipaObjectUtils";

export interface ValueDateTime {
  valueDate: string;
  valueTime: string;
}

export interface ParamPropertiesDateTime {
  writable: boolean;
  required: boolean;
  readOnly: boolean;
  value: Date | null;
  onChange: (value: BasicType) => void;
  paramMetadata: ParamMetadata;
}

function getDateTimeValue(value: BasicType): Date | null {
  if (value && Array.isArray(value) && value.length > 0 && value[0]) {
    return parseFullDateStringToUTCFormat((value[0] as IPADate).__datetime__);
  } else if (value && typeof value === 'string' || value instanceof String) {
    return  parseFullDateStringToUTCFormat(value.toString());
  }
  return null;
}

function hhMMFormat(date: Date): string {
  return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
}

function yyyyMMddFormat(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

const IpaCalendar = (props: IPAParamDefinition) => {

  const { readOnly, value } = getParamProperties(props);
  const valueDate = getDateTimeValue(value);

  // On change date handler
  const onDateChange = (
    _event: React.FormEvent<HTMLInputElement>,
    inputDate: string,
    newFromDate: Date | undefined
  ) => {
    if (newFromDate === undefined || !isValidDate(newFromDate)) {
      return;
    }
    const newDate = new Date();
    newDate.setUTCFullYear(newFromDate.getFullYear());
    newDate.setUTCMonth(newFromDate.getMonth());
    newDate.setUTCDate(newFromDate.getDate());

    if (valueDate && isValidDate(valueDate)) {
      newDate.setUTCHours(valueDate.getUTCHours());
      newDate.setUTCMinutes(valueDate.getUTCMinutes());
    }

    // Update 'ipaObject' with the new date
    // - Parse to generalized format (to return to the "user_mod" API call)
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      const LDAPDate = toGeneralizedTime(newDate);
      updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
    }
  };

  // On change time handler
  const onTimeChange = (_event, time: string, hour: number | undefined, minute: number | undefined) => {
    if (hour === undefined || minute === undefined) {
      return;
    }
    let newDate = new Date();
    if (valueDate && isValidDate(valueDate)) {
      newDate = valueDate;
    }
    newDate.setUTCHours(hour);
    newDate.setUTCMinutes(minute);

    // Update 'ipaObject' with the new date
    // - Parse to generalized format (to return to the "user_mod" API call)
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      const LDAPDate = toGeneralizedTime(newDate);
      updateIpaObject(props.ipaObject, props.onChange, LDAPDate, props.name);
    }
  };

  // Parse the current date into 'HH:MM' format

  return (
    <InputGroup>
      <DatePicker
        name={props.name}
        value={valueDate !== null ? yyyyMMddFormat(valueDate) : ""}
        onChange={onDateChange}
        aria-label="Kerberos principal expiration date"
        placeholder="YYYY-MM-DD"
        isDisabled={readOnly}
      />
      <TimePicker
        name={props.name}
        time={valueDate !== null ? hhMMFormat(valueDate) : ""}
        aria-label="Kerberos principal expiration time"
        onChange={onTimeChange}
        placeholder="HH:MM"
        is24Hour={true}
        isDisabled={readOnly}
      />
    </InputGroup>
  );
};

export default IpaCalendar;
