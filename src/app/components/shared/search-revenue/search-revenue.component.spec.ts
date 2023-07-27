import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'; 
import { SearchRevenueComponent } from './search-revenue.component';

describe('SearchRevenueComponent', () => {
  let component: SearchRevenueComponent;
  let fixture: ComponentFixture<SearchRevenueComponent>; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRevenueComponent ] 
    })
    .compileComponents(); 
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(SearchRevenueComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    tick(800); 
    fixture.detectChanges();
  })); 

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('should emit search value', () => {
    component.onSearch('facility');
    expect(component).toBeTruthy();
  }); 

  it('should clear search value', () => {
    component.clearSearchInput();
    expect(component).toBeTruthy();
  }); 
});
