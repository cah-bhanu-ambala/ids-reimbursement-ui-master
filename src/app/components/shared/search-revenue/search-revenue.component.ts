import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-revenue',
  templateUrl: './search-revenue.component.html',
  styleUrls: ['./search-revenue.component.scss']
})
export class SearchRevenueComponent implements OnInit {

  @Output() setValue: EventEmitter<string> = new EventEmitter();

  @Input() placeholderText: string = 'Search';

  @Input() id: string = "";

  @ViewChild('searchInput') searchInput: ElementRef;

  showDelIcon: boolean = false;

  private _searchSubject: Subject<string> = new Subject();

  constructor() {
    this.setSearchSubscription();
  }

  private setSearchSubscription() {
    this._searchSubject
      .pipe(
        debounceTime(800),
        distinctUntilChanged())
      .subscribe(result => {
        this.setValue.emit(result);
      });
  }

  public onSearch(searchTextValue: string) {
    if (searchTextValue != '') { this.showDelIcon = true; }
    this._searchSubject.next(searchTextValue);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._searchSubject.unsubscribe();
  }

  clearSearchInput() {
    this.searchInput.nativeElement.value = '';
    this.showDelIcon = false;
    this.onSearch('');    
  }

}
