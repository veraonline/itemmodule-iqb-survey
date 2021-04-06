import {
  Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StartData } from './classes/interfaces';
import { ParserService } from './parser.service';
import { UIBlock } from './classes/UIBlock';

@Component({
  template: `
    <form [formGroup]="form">
      <div *ngFor="let element of rootBlock.elements" [style.margin]="'0px 30px'">
        <player-sub-form [elementData]="element" [parentForm]="form"
                         (elementDataChange)="formValueChanged()"
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

  rootBlock: UIBlock = new UIBlock('0');
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

  formValueChanged(): void {
    const allValues = this.dataService.getValues();
    this.dataService.rootBlock.check(allValues);
    this.valueChanged.emit(JSON.stringify(allValues));
  }
}
