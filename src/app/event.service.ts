import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private navigationDenied = new Subject<string[]>();

  constructor() {
    fromEvent(window, 'vopNavigationDeniedNotification')
      .subscribe((e: CustomEvent) => this.navigationDenied.next(e.detail));
  }

  get navigationDenied$(): Observable<string[]> {
    return this.navigationDenied.asObservable();
  }
}
