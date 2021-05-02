import {
  Component, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { LikertBlock } from '../classes/UIBlock';
import {LikertElement} from "../classes/UIElement";

@Component({
  selector: 'player-likert',
  template: `
    <mat-card fxLayout="column" fxLayoutAlign="start stretch">
      <div fxLayout="row" fxLayoutAlign="space-between center">
        <div fxFlex="40">&nbsp;</div>
        <div fxFlex="60" fxLayout="row" fxLayoutAlign="space-around center">
          <div *ngFor="let header of elementDataAsLikertBlock.headerList"
               fxFlex fxLayout="row" fxLayoutAlign="center center">{{ header }}</div>
        </div>
      </div>
      <mat-card-content fxLayout="column" fxLayoutAlign="start stretch">
        <div *ngFor="let element of elementDataAsLikertBlock.elements"
             [formGroup]="parentForm" fxLayout="column" class="likert-row" >
          <div *ngIf="element.fieldType == fieldType.SCRIPT_ERROR">
            {{element.errorText}}
          </div>
          <div *ngIf="element.fieldType !== fieldType.SCRIPT_ERROR" fxLayout="row" fxLayoutAlign="space-between center">
            <div fxFlex="40" [matTooltip]="element.helpText">{{element.text}}</div>
            <mat-radio-group [formControlName]="element.id" fxFlex="60"
                             fxLayout="row" fxLayoutAlign="space-around center">
              <mat-radio-button fxFlex [value]="header"
                                *ngFor="let header of elementDataAsLikertBlock.headerList;let i=index;"
                                [formControlName]="element.id" ngDefaultControl>
              </mat-radio-button>
            </mat-radio-group>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    '.mat-radio-label {flex-direction: row; place-content: center center}',
    '.likert-row:nth-child(even) {background-color: #F5F5F5;}',
    '.likert-row:nth-child(odd) {background-color: lightgrey;}',
    '.likert-row {padding: 4px}'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LikertComponent extends ElementComponent implements OnInit, OnDestroy {
  formControls = [];
  valueChangeSubscriptions: Subscription[] = [];

  ngOnInit(): void {
    const elementData = this.elementData as LikertBlock;
    elementData.elements.forEach(likertElement => {
      if (likertElement instanceof LikertElement) {
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
