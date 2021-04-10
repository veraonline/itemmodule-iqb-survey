import {
  Component, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { LikertBlock } from '../classes/UIBlock';

@Component({
  selector: 'player-likert',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="10px">
      <div>
        <div id="header" fxFlexOffset="25" fxFlex fxLayout="row" fxLayoutAlign="space-between center">
          <div fxFlex fxLayoutAlign="center center"
               *ngFor="let header of elementDataAsLikertBlock.headerList">
            <mat-card>{{ header }}</mat-card>
          </div>
        </div>
      </div>
      <div id="elements" *ngFor="let element of elementDataAsLikertBlock.elements" [formGroup]="parentForm">
        <div *ngIf="element.fieldType == fieldType.SCRIPT_ERROR">
          {{element.errorText}}
        </div>
        <div *ngIf="element.fieldType !== fieldType.SCRIPT_ERROR">
          <div fxFlex="25">{{element.text}}</div>
          <mat-radio-group [formControlName]="element.id" fxFlex fxLayout="row" fxLayoutAlign="space-between center">
            <mat-radio-button fxFlex [value]="header"
                              *ngFor="let header of elementDataAsLikertBlock.headerList;let i=index;"
                              [formControlName]="element.id" ngDefaultControl>
            </mat-radio-button>
          </mat-radio-group>
        </div>
      </div>
    </div>
  `,
  styles: [
    'player-likert .mat-radio-label {flex-direction: column;}',
    'player-likert #elements:nth-child(even) {background-color: #F5F5F5;}',
    'player-likert #elements:nth-child(odd) {background-color: lightgrey;}',
    'player-likert {margin: 20px 5px}'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LikertComponent extends ElementComponent implements OnInit, OnDestroy {
  formControls = [];
  valueChangeSubscriptions: Subscription[] = [];

  ngOnInit(): void {
    const elementData = this.elementData as LikertBlock;
    elementData.elements.forEach(likertElement => {
      const formControl = new FormControl(likertElement.id);
      this.formControls.push(formControl);
      this.parentForm.addControl(likertElement.id, formControl);
      formControl.valueChanges.subscribe(newValue => {
        formControl.markAsTouched();
        likertElement.value = String(newValue);
        // Need to manually emit this, since the LikertBlock has no value prop to set and trigger the parent method
        this.elementDataChange.emit(likertElement);
      });
      if (likertElement.value) {
        formControl.setValue(likertElement.value);
      }
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.formControls.forEach(formControl => {
      this.parentForm.removeControl(formControl);
    });
  }
}
