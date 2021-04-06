// eslint-disable-next-line max-classes-per-file
import { FieldType, PropertyKey } from './interfaces';

export interface UIElementOrBlock {
  getCopy(): UIElementOrBlock;
}

export class UIElement implements UIElementOrBlock {
  id = '';
  fieldType: FieldType;
  value = null;
  properties: Map<PropertyKey, string> = new Map();
  helpText = '';

  hidden: boolean = false;

  constructor(id: string, fieldType: FieldType, helpText: string = '') {
    this.id = id; // TODO gehört eigentlich nur in InputElement. Sollte aus anderen Typen rausrefactored werden
    this.fieldType = fieldType;
    this.helpText = helpText;
  }

  check(values: Record<string, string>): void {
    this.hidden = false;
    if (values[this.id]) {
      this.value = values[this.id];
    }
  }

  getValues(): Record<string, string> {
    return { };
  }

  hide(): void {
    this.hidden = true;
  }

  getCopy(idSuffix = ''): UIElement {
    const copy = new UIElement(this.id + idSuffix, this.fieldType, this.helpText);
    this.properties.forEach((value, key) => {
      copy.properties.set(key, value);
    });
    copy.helpText = this.helpText;
    if (idSuffix.length === 0) {
      copy.value = this.value;
    }
    return copy;
  }
}

export class InputElement extends UIElement {
  required = false;
  constructor(id: string, fieldType: FieldType, required: boolean, helpText: string) {
    super(id, fieldType, helpText);
    this.required = required;
  }

  getCopy(idSuffix = ''): InputElement {
    const copyElement = super.getCopy(idSuffix) as InputElement;
    copyElement.required = this.required;
    return copyElement;
  }

  getValues(): Record<string, string> {
    if (this.hidden) {
      return { };
    }
    return { [this.id]: this.value };
  }
}

export class TextElement extends UIElement {
  constructor(id: string, fieldType = FieldType.TEXT, text: string, helpText: string) {
    super(id, fieldType, helpText);
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
    super('0', FieldType.NAV_BUTTON_GROUP);
    if (options) this.properties.set(PropertyKey.TEXT2, options);
  }
}

export class ErrorElement extends UIElement {
  constructor(id: string, errorText: string) {
    super(id, FieldType.SCRIPT_ERROR);
    this.properties.set(PropertyKey.TEXT, errorText);
  }
}
