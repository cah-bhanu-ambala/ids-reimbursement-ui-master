import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private showSub = new Subject<boolean>();

  show$ = this.showSub.asObservable();

  constructor() { }

  setSpinner(state: boolean): void {
    this.showSub.next(state);
  }

  setDisplay(display: boolean): void {
    const spinnerEl = document.getElementById('spinner');

    if (display) {
      spinnerEl.classList.remove('d-none');
    } else {
      spinnerEl.classList.add('d-none');
    }
  }

}
