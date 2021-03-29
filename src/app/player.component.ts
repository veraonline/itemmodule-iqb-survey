import {
  Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StartData } from './classes/interfaces';
import { DataService } from './data.service';

@Component({
  template: `
    <form [formGroup]="form">
      <div *ngFor="let element of dataService.rootBlock.elements" [style.margin]="'0px 30px'">
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

  form = new FormGroup({});

  constructor(public dataService: DataService) {}

  @Input()
  set startData(startData: StartData) {
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitState?.dataParts?.allResponses &&
          Object.keys(startData.unitState?.dataParts?.allResponses).length > 0) {
        storedResponses = JSON.parse(startData.unitState.dataParts.allResponses);
      }
      this.dataService.setElements(startData.unitDefinition.split('\n'), storedResponses);
      this.formValueChanged();
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
