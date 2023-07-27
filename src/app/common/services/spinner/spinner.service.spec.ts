import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set showSub', (done) => {
    const subs = service.show$.subscribe(state => {
      expect(state).toBeTruthy();
      done();
    });

    service.setSpinner(true);
  });

  it('should set display', () => {
    const list: string[] = [];
    spyOn(document, 'getElementById').and.callFake((elementId) => {
      return {
        classList: {
          add: (tokens: string) => {
            list.push(tokens);
          },
          remove: (tokens: string) => {
            list.pop();
          }
        }
      } as any;
    });

    service.setDisplay(false);
    expect(list.includes('d-none')).toBeTruthy();
    service.setDisplay(true);
    expect(list.includes('d-none')).toBeFalsy();
  });
});
