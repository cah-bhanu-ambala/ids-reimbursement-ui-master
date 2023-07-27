
import { Component, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { Observable } from 'rxjs';
import { DirtyCheckGuard } from './dirty.guard';

describe('AuthGuard', () => {
  let guard: DirtyCheckGuard;
  let mockComponent: DirtyCheckGuard;
  let fixture: ComponentFixture<DirtyCheckGuard>;
  let modalService: BsModalService
  //let mockComponent: MockComponent;
  // let routeMock: any = { snapshot: {}}
  // let routeStateMock: any = { snapshot: {}, url: '/cookies'};
  // let routerMock = {navigate: jasmine.createSpy('navigate')}

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirtyCheckGuard, BsModalService, ComponentLoaderFactory, PositioningService]
    });
    guard = TestBed.inject(DirtyCheckGuard);
    mockComponent = TestBed.inject(DirtyCheckGuard);
    modalService = TestBed.inject(BsModalService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('can route if unguarded', () => {
    // Mock GuardedComponent.isGuarded = false, which returns true from canActivate()
    
    //mockComponent.returnValue = true;
    expect(mockComponent.canDeactivate).toBeTruthy();
  });


  // it('should be canActivate', () => {
  //   let isDirty: boolean = true;
  //   expect(guard.canDeactivate(isDirty)).toBeTrue();
  // });

  // it('can route if unguarded', () => {
  //   // Mock GuardedComponent.isGuarded = false, which returns true from canActivate()   
  //   let isDirty: IDirty;
  //   expect(component.canDeactivate(isDirty)).toBeTruthy();
  // });


  //   it('should be canActivate', () => {
  //     expect(guard.canDeactivate(, routeMock)).toBeTrue();
  //   });



  //   it('will route if guarded and user accepted the dialog', () => {
  //     // Mock the behavior of the GuardedComponent:
  //     const subject$ = new Subject<boolean>();
  //     mockComponent.returnValue = subject$.asObservable();
  //     const canDeactivate$ = <Observable<boolean>>service.canDeactivate(mockComponent);
  //     canDeactivate$.subscribe((deactivate) => {
  //       // This is the real test!
  //       expect(deactivate).toBeTruthy();
  //     });
  //     // emulate the accept()
  //     subject$.next(true);
  //   });

  //   it('will not route if guarded and user rejected the dialog', () => {
  //     // Mock the behavior of the GuardedComponent:
  //     const subject$ = new Subject<boolean>();
  //     mockComponent.returnValue = subject$.asObservable();
  //     const canDeactivate$ = <Observable<boolean>>service.canDeactivate(mockComponent);
  //     canDeactivate$.subscribe((deactivate) => {
  //       // This is the real test!
  //       expect(deactivate).toBeFalsy();
  //     });
  //     // emulate the reject()
  //     subject$.next(false);
  //   });

});

interface IDirty {
  isDirty: boolean;
  getRef: ViewContainerRef;
}

class MockComponent implements CanDeactivate<IDirty> {
  // Set this to the value you want to mock being returned from GuardedComponent
  returnValue: boolean | Observable<boolean>;

  canDeactivate(): boolean | Observable<boolean> {
    return this.returnValue;
  }
}
