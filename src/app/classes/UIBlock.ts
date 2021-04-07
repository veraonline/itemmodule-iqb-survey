// eslint-disable-next-line max-classes-per-file
import { InputElement, UIElement, UIElementOrBlock } from './UIElement';
import { PropertyKey } from './interfaces';

export class UIBlock implements UIElementOrBlock {
  elements: (UIElement | UIBlock)[] = [];
  hidden: boolean = false;

  getValues(): Record<string, string> {
    let values = {};
    this.elements.forEach(element => {
      values = { ...values, ...element.getValues() };
    });
    return { ...values };
  }

  getCopy(idSuffix = ''): UIBlock {
    const copy = new UIBlock();
    this.elements.forEach(e => {
      copy.elements.push(e.getCopy(idSuffix));
    });
    return copy;
  }

  check(values: Record<string, string>): void {
    this.hidden = false;
    this.elements.forEach(e => {
      e.check(values);
    });
  }

  hide(): void {
    this.hidden = true;
  }
}

export class RepeatBlock extends UIBlock {
  id: string;
  value: string;
  properties: Map<PropertyKey, string> = new Map();
  templateElements: (UIElement | UIBlock)[] = [];
  helpText = '';
  localIDs = []; // array of IDs in the RepeatBlock, so IfBlocks can adjust their condition var

  constructor(id: string, textBefore:string = '', textAfter:string = '', maxBlocks: string = '',
              helpText: string = '') {
    super();
    this.id = id;
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
    this.hidden = false;
    if (values[this.id]) {
      this.value = values[this.id];
    }
    this.setSubBlockNumber(Number(this.value), values);
    super.check(values);
  }

  getValues(): Record<string, string> {
    if (this.hidden || !this.value) {
      return { };
    }
    let values = {};
    this.elements.forEach(element => {
      values = { ...values, ...element.getValues() };
    });
    return { ...values, [this.id]: this.value };
  }

  setSubBlockNumber(n: number, values = {}): void {
    const newBlocks: (UIElement | UIBlock)[] = [];
    const oldSubBlockNumber = this.elements.length;
    for (let i = 0; i < n; i++) {
      if (i < oldSubBlockNumber) {
        newBlocks.push(this.elements[i]);
      } else {
        const newBlock = new UIBlock();
        this.templateElements.forEach(templateElement => {
          const newElement = templateElement.getCopy(`_${(i + 1).toString()}`);
          if (newElement instanceof InputElement) {
            this.localIDs.push(newElement.id.substr(0, newElement.id.length - 2)); // cut away the new affix
            if (values[newElement.id]) {
              newElement.value = values[newElement.id];
            }
          }
          if (newElement instanceof IfThenElseBlock) {
            this.affixIfBlockConditionVariable(newElement, i);
          }
          newBlock.elements.push(newElement);
        });
        newBlocks.push(newBlock);
      }
    }
    this.elements = newBlocks;
  }

  affixIfBlockConditionVariable(newElement: IfThenElseBlock, index: number): void {
    if (this.localIDs.includes(newElement.conditionVariableName)) {
      newElement.conditionVariableName += `_${(index + 1).toString()}`;
    }
    newElement.trueElements.forEach(element => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (element instanceof IfThenElseBlock) {
        this.affixIfBlockConditionVariable(element, index);
      }
    });
    newElement.falseElements.forEach(element => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (element instanceof IfThenElseBlock) {
        this.affixIfBlockConditionVariable(element, index);
      }
    });
  }
}

export class IfThenElseBlock extends UIBlock {
  conditionVariableName = '';
  conditionTrueValue = '';
  trueElements: (UIElement | UIBlock)[] = [];
  falseElements: (UIElement | UIBlock)[] = [];

  constructor(conditionVariableName: string, conditionTrueValue: string) {
    super();
    this.conditionVariableName = conditionVariableName;
    this.conditionTrueValue = conditionTrueValue;
  }

  getCopy(idSuffix = ''): IfThenElseBlock {
    const copy = new IfThenElseBlock(this.conditionVariableName,
      this.conditionTrueValue);
    this.trueElements.forEach(e => {
      copy.trueElements.push(e.getCopy(idSuffix));
    });
    this.falseElements.forEach(e => {
      copy.falseElements.push(e.getCopy(idSuffix));
    });
    return copy;
  }

  check(values: Record<string, string>): void {
    if (String(values[this.conditionVariableName]) === this.conditionTrueValue) {
      this.elements = this.trueElements;
      this.falseElements.forEach(e => {
        e.hide();
      });
      this.trueElements.forEach(e => {
        e.check(values);
      });
    } else {
      this.elements = this.falseElements;
      this.trueElements.forEach(e => {
        e.hide();
      });
      this.falseElements.forEach(e => {
        e.check(values);
      });
    }
  }
}
