// eslint-disable-next-line max-classes-per-file
import { FieldType, PropertyKey } from './interfaces';

export interface UIElementOrBlock {
  getCopy(): UIElementOrBlock;
}

export class UIElement implements UIElementOrBlock {
  fieldType: FieldType;
  properties: Map<PropertyKey, string> = new Map();
  helpText = '';

  hidden: boolean = false;

  constructor(fieldType: FieldType, helpText: string = '') {
    this.fieldType = fieldType;
    this.helpText = helpText;
  }

  /** Since basic elements have no value, nothing needs to be checked */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  check(values: Record<string, string>): void {
  }

  /** Since basic elements have no value, this does nothing */
  // eslint-disable-next-line class-methods-use-this
  getValues(): Record<string, string> {
    return { };
  }

  hide(): void {
    this.hidden = true;
  }

  getCopy(idSuffix = ''): UIElement {
    let copy;
    if (this instanceof InputElement) {
      copy = new InputElement(this.id + idSuffix, this.fieldType, this.required, this.helpText);
    } else {
      copy = new UIElement(this.fieldType, this.helpText);
    }
    this.properties.forEach((value, key) => {
      copy.properties.set(key, value);
    });
    copy.helpText = this.helpText;
    return copy;
  }
}

export class InputElement extends UIElement {
  id: string;
  value: string;
  required = false;

  constructor(id: string, fieldType: FieldType, required: boolean, helpText: string) {
    super(fieldType, helpText);
    this.id = id;
    this.required = required;
  }

  check(values: Record<string, string>): void {
    this.hidden = false;
    if (values[this.id]) {
      this.value = values[this.id];
    }
  }

  getValues(): Record<string, string> {
    if (this.hidden) {
      return { };
    }
    return { [this.id]: this.value };
  }

  getCopy(idSuffix = ''): InputElement {
    const copyElement = super.getCopy(idSuffix) as InputElement;
    copyElement.value = this.value;
    copyElement.required = this.required;
    return copyElement;
  }
}

export class TextElement extends UIElement {
  constructor(fieldType = FieldType.TEXT, text: string, helpText: string) {
    super(fieldType, helpText);
    this.properties.set(PropertyKey.TEXT, text);
  }
}

export class TextInputElement extends InputElement {
  constructor(id: string, variableParam: string, required: boolean, textBefore: string, textAfter: string,
              maxLines: string, maxLength: string, helpText: string) {
    super(variableParam, FieldType.INPUT_TEXT, required, helpText);
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
    if (maxLines) this.properties.set(PropertyKey.LINES_NUMBER, maxLines);
    if (maxLength) this.properties.set(PropertyKey.MAX_LENGTH, maxLength);
  }
}

export class NumberInputElement extends InputElement {
  constructor(id: string, variableParam: string, required: boolean, textBefore: string, textAfter: string,
              minValue: string, maxValue: string, helpText: string) {
    super(variableParam, FieldType.INPUT_NUMBER, required, helpText);
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
    if (minValue) this.properties.set(PropertyKey.MIN_VALUE, minValue);
    if (maxValue) this.properties.set(PropertyKey.MAX_VALUE, maxValue);
  }
}

export class CheckboxElement extends InputElement {
  constructor(id: string, variableParam: string, required: boolean, textBefore: string, textAfter: string,
              helpText: string) {
    super(variableParam, FieldType.CHECKBOX, required, helpText);
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
    this.value = 'false';
  }
}

export class MultiChoiceElement extends InputElement {
  constructor(id: string, variableParam: string, required: boolean, textBefore: string, textAfter: string,
              helpText: string) {
    super(variableParam, FieldType.MULTIPLE_CHOICE, required, helpText);
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
  }
}

export class DropDownElement extends InputElement {
  constructor(id: string, variableParam: string, required: boolean, textBefore: string, textAfter: string,
              helpText: string) {
    super(variableParam, FieldType.DROP_DOWN, required, helpText);
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
  }
}

export class NavButtonGroupElement extends UIElement {
  constructor(options: string) {
    super(FieldType.NAV_BUTTON_GROUP);
    if (options) this.properties.set(PropertyKey.TEXT2, options);
  }
}

export class ErrorElement extends UIElement {
  constructor(errorText: string) {
    super(FieldType.SCRIPT_ERROR);
    this.properties.set(PropertyKey.TEXT, errorText);
  }
}
