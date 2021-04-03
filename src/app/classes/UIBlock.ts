// eslint-disable-next-line max-classes-per-file
import { UIElement, UIElementOrBlock } from './UIElement';
import { PropertyKey } from './interfaces';

export class UIBlock implements UIElementOrBlock {
  id = '';
  value = '';
  elements: (UIElement | UIBlock)[] = [];

  constructor(id: string) {
    this.id = id;
  }

  getCopy(idSuffix = ''): UIBlock {
    const copy = new UIBlock(this.id);
    this.elements.forEach(e => {
      copy.elements.push(e.getCopy(idSuffix));
    });
    return copy;
  }

  check(values: Record<string, string>): void {
    this.elements.forEach(e => {
      e.check(values);
    });
  }
}

export class RepeatBlock extends UIBlock {
  properties: Map<PropertyKey, string> = new Map();
  templateElements: (UIElement | UIBlock)[] = [];
  helpText = '';
  localIDs = []; // array of IDs int he RepeatBlock, so IfBlocks can adjust their cond var

  constructor(id: string, textBefore:string = '', textAfter:string = '', maxBlocks: string = '',
              helpText: string = '') {
    super(id);
    this.helpText = helpText;
    if (textBefore) this.properties.set(PropertyKey.TEXT, textBefore);
    if (textAfter) this.properties.set(PropertyKey.TEXT2, textAfter);
    if (maxBlocks) this.properties.set(PropertyKey.MAX_VALUE, maxBlocks);
  }

  getCopy(idSuffix = ''): RepeatBlock {
    const copy = new RepeatBlock(this.id + idSuffix, '', '', '', this.helpText);
    this.properties.forEach((value, key) => {
      copy.properties.set(key, value);
    });
    copy.helpText = this.helpText;
    this.templateElements.forEach(e => {
      copy.templateElements.push(e.getCopy());
    });
    copy.value = this.value;
    return copy;
  }

  check(values: Record<string, string>): void {
    if (values[this.id]) {
      this.value = values[this.id];
    }
    this.setSubBlockNumber(Number(this.value), values);
    super.check(values);
  }

  setSubBlockNumber(n: number, values = {}): void {
    const newBlocks: (UIElement | UIBlock)[] = [];
    const oldSubBlockNumber = this.elements.length;
    for (let i = 0; i < n; i++) {
      if (i < oldSubBlockNumber) {
        newBlocks.push(this.elements[i]);
      } else {
        const newBlock = new UIBlock(this.id);
        this.templateElements.forEach(templateElement => {
          const newElement = templateElement.getCopy(`_${(i + 1).toString()}`);
          if (newElement instanceof UIElement) {
            this.localIDs.push(newElement.id.substr(0, newElement.id.length - 2)); // cut away the new affix
            if (values[newElement.id]) {
              newElement.value = values[newElement.id];
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (newElement instanceof IfThenElseBlock) {
            if (this.localIDs.includes(newElement.conditionVariableName)) {
              newElement.conditionVariableName += `_${(i + 1).toString()}`;
            }
          }
          newBlock.elements.push(newElement);
        });
        newBlocks.push(newBlock);
      }
    }
    this.elements = newBlocks;
  }
}

export class IfThenElseBlock extends UIBlock {
  conditionVariableName = '';
  conditionTrueValue = '';
  trueElements: (UIElement | UIBlock)[] = [];
  falseElements: (UIElement | UIBlock)[] = [];

  constructor(id: string, conditionVariableName: string, conditionTrueValue: string) {
    super(id);
    this.conditionVariableName = conditionVariableName;
    this.conditionTrueValue = conditionTrueValue;
  }

  getCopy(idSuffix = ''): IfThenElseBlock {
    const copy = new IfThenElseBlock(this.id + idSuffix,
      this.conditionVariableName,
      this.conditionTrueValue);
    this.trueElements.forEach(e => {
      copy.trueElements.push(e.getCopy(idSuffix));
    });
    this.falseElements.forEach(e => {
      copy.falseElements.push(e.getCopy(idSuffix));
    });
    copy.value = this.value;
    return copy;
  }

  check(values: Record<string, string>): void {
    if (String(values[this.conditionVariableName]) === this.conditionTrueValue) {
      this.value = 'true';
      this.elements = this.trueElements;
      this.trueElements.forEach(e => {
        e.check(values);
      });
    } else {
      this.value = 'false';
      this.elements = this.falseElements;
      this.falseElements.forEach(e => {
        e.check(values);
      });
    }
  }
}
