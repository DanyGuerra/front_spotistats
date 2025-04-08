import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'timeFromNow',
  standalone: true,
  pure: false,
})
export class TimeFromNowPipe implements PipeTransform {
  private currentLang: string;
  private lastValue!: string;
  private lastResult!: string | null;
  private subscription: Subscription;

  constructor(private translate: TranslateService) {
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang();
    moment.locale(this.currentLang);

    this.subscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      moment.locale(this.currentLang);
      this.lastResult = null;
    });
  }

  transform(value: string): string {
    if (value !== this.lastValue || !this.lastResult) {
      this.lastValue = value;
      this.lastResult = moment.utc(value).fromNow();
    }
    return this.lastResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
