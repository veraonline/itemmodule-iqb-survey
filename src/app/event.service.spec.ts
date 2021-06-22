import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let eventService: EventService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    eventService = TestBed.inject(EventService);
  });

  it('should be created',
    () => {
      expect(eventService).toBeTruthy();
    });

  it('should receive 2 vopNavigationDeniedNotification Events',
    () => {
      let counter = 0;
      eventService.navigationDenied$
        .subscribe((): number => {
          (counter += 1);
          return counter;
        });
      window.dispatchEvent(new Event('click'));
      window.dispatchEvent(new Event('vopNavigationDeniedNotification'));
      window.dispatchEvent(new CustomEvent('NavigationDeniedNotification'));
      window.dispatchEvent(new CustomEvent('BlaBla'));
      window.dispatchEvent(new CustomEvent('vopNavigationDeniedNotification'));
      window.dispatchEvent(new Event('scroll'));
      expect(counter).toBe(2);
    });
});
