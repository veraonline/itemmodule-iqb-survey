import {
  Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StartData } from './classes/interfaces';
import { ParserService } from './parser.service';
import { RepeatBlock, UIBlock } from './classes/UIBlock';
import { InputElement } from './classes/UIElement';

@Component({
  template: `
    <form [formGroup]="form">
      <div *ngFor="let element of rootBlock.elements" [style.margin]="'0px 30px'">
        <player-sub-form [elementData]="element" [parentForm]="form"
                         (elementDataChange)="formValueChanged($event)"
                         (navigationRequested)="this.navigationRequested.emit($event);">
        </player-sub-form>
      </div>
    </form>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent {
  @Output() valueChanged = new EventEmitter<string>();
  @Output() navigationRequested = new EventEmitter<string>();
  // @Output() ready = new EventEmitter(); // TODO bitte prüfen ob nötig, dass der Player ready meldet

  rootBlock: UIBlock;
  allValues: Record<string, string>;
  form: FormGroup;

  constructor(public parserService: ParserService) {
    this.initFields();
  }

  initFields(): void {
    this.rootBlock = new UIBlock();
    this.allValues = {};
    this.form = new FormGroup({});
  }

  @Input()
  set startData(startData: StartData) {
    this.initFields();
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitStateData) {
        storedResponses = JSON.parse(startData.unitStateData);
        console.log('player: got unit responses', storedResponses);
      }
      this.rootBlock = this.parserService.parseUnitDefinition(startData.unitDefinition.split('\n'));
      this.rootBlock.check(storedResponses);
    } else {
      console.warn('player: (setStartData) no unitDefinition is given');
    }
  }

  public tryLeaveNotify(): void {
    this.form.markAllAsTouched();
  }

  formValueChanged(event: InputElement | RepeatBlock): void {
    this.rootBlock.check({ ...this.allValues, [event.id]: event.value });
    this.allValues = this.rootBlock.getValues();
    console.log('player: unit responses sent', this.allValues);
    this.valueChanged.emit(JSON.stringify(this.allValues));
  }
}
