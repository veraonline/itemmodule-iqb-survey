export enum PropertyKey {
  TEXT,
  TEXT2,
  MAX_VALUE,
  MIN_VALUE,
  MAX_LENGTH,
  LINES_NUMBER
}

export enum FieldType {
  TEXT,
  HEADER,
  TITLE,
  INPUT_TEXT,
  INPUT_NUMBER,
  HTML,
  HR,
  CHECKBOX,
  MULTIPLE_CHOICE,
  DROP_DOWN,
  REPEAT_CONTROL,
  SCRIPT_ERROR,
  NAV_BUTTON_GROUP,
  LIKERT_ELEMENT
}

export interface KeyValuePairString {
  [K: string]: string;
}

export interface StartData {
  unitDefinition: string;
  unitStateData: string;
}

export enum NavButtonOptions {
  'previous',
  'next',
  'first',
  'last',
  'end'
}
