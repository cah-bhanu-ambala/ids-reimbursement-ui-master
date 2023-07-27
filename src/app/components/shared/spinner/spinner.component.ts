import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/common/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnDestroy, OnInit {

  private showSubs = new Subscription();

  show = false;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.showSubscription();
  }

  ngOnDestroy(): void {
    this.showSubs.unsubscribe();
  }

  private showSubscription(): void {
    this.showSubs = this.spinnerService.show$.subscribe(state => {
      setTimeout(() => {
        this.show = state;
      });
    });
  }

}
