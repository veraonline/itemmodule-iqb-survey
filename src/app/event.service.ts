import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private navigationDenied = new Subject<string[]>();
  private scrollY = new Subject<number>();

  constructor() {
    fromEvent(window, 'vopNavigationDeniedNotification')
      .subscribe((e: CustomEvent) => this.navigationDenied.next(e.detail));
    fromEvent(window, 'scroll')
      .subscribe(() => this.scrollY.next(window.scrollY));
  }

  get navigationDenied$(): Observable<string[]> {
    return this.navigationDenied.asObservable();
  }

  get scrollY$(): Observable<number> {
    return this.scrollY.asObservable();
  }
}
