import {Component, OnDestroy, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnDestroy {
  currentSecond = signal(0);
  updateSecond = output<number>();

  private subscription: Subscription;

  constructor() {
    this.subscription = interval(1000).subscribe(() => {
      const nextSecond = (this.currentSecond() + 1) % 60;
      this.currentSecond.set(nextSecond);
      this.updateSecond.emit(nextSecond);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
