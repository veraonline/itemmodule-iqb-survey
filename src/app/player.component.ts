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

  rootBlock: UIBlock = new UIBlock();
  allValues = {};

  form = new FormGroup({});

  constructor(public parserService: ParserService) { }

  @Input()
  set startData(startData: StartData) {
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitState?.dataParts?.allResponses &&
          Object.keys(startData.unitState?.dataParts?.allResponses).length > 0) {
        storedResponses = JSON.parse(startData.unitState.dataParts.allResponses);
      }
      this.rootBlock = this.parserService.parseUnitDefinition(startData.unitDefinition.split('\n'));
      this.rootBlock.check(storedResponses);
    } else {
      console.warn('player: (setStartData) no unitDefinition is given');
    }
  }

  public tryLeaveNotify(): void { // TODO
    this.form.markAllAsTouched();
  }

  formValueChanged(event: InputElement | RepeatBlock): void {
    this.rootBlock.check({ ...this.allValues, [event.id]: event.value });
    this.allValues = this.rootBlock.getValues();
    console.log('allValues: ', this.allValues);
    this.valueChanged.emit(JSON.stringify(this.allValues));
  }
}
