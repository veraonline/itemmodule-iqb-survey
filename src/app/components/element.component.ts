import {
  Directive, Input, EventEmitter, Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputElement, UIElement } from '../classes/UIElement';
import { IfThenElseBlock, RepeatBlock } from '../classes/UIBlock';
import { FieldType } from '../classes/interfaces';

@Directive()
export abstract class ElementComponent {
  @Input() elementData: UIElement | RepeatBlock | IfThenElseBlock;
  @Input() parentForm: FormGroup;
  @Output() elementDataChange = new EventEmitter<UIElement | RepeatBlock | IfThenElseBlock>();
  @Output() valueChange = new EventEmitter<string>();
  fieldType = FieldType;

  set value(value: string) {
    (this.elementData as InputElement).value = value;
    this.elementDataChange.emit(this.elementData);
    this.valueChange.emit(value);
  }

  get value(): string {
    return (this.elementData as InputElement).value;
  }

  get elementDataAsUIElement(): UIElement {
    if (this.elementIsUIElement) {
      return this.elementData as UIElement;
    }
    return null;
  }

  get elementDataAsRepeatBlock(): RepeatBlock {
    if (this.elementIsRepeatBlock) {
      return this.elementData as RepeatBlock;
    }
    return null;
  }

  get elementDataAsIfThenElseBlock(): IfThenElseBlock {
    if (this.elementIsIfThenElseBlock) {
      return this.elementData as IfThenElseBlock;
    }
    return null;
  }

  elementIsUIElement(): boolean {
    return this.elementData instanceof UIElement;
  }

  elementIsRepeatBlock(): boolean {
    return this.elementData instanceof RepeatBlock;
  }

  elementIsIfThenElseBlock(): boolean {
    return this.elementData instanceof IfThenElseBlock;
  }
}
