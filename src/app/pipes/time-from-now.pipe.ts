import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS, es, fr, de, Locale } from 'date-fns/locale';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'timeFromNow',
  standalone: true,
  pure: false,
})
export class TimeFromNowPipe implements PipeTransform, OnDestroy {
  private currentLang: string;
  private lastValue!: string;
  private lastResult!: string | null;
  private subscription: Subscription;

  private locales: { [key: string]: Locale } = {
    en: enUS,
    es: es,
    fr: fr,
    de: de,
  };

  constructor(private translate: TranslateService) {
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang();
    this.subscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.lastResult = null;
    });
  }

  transform(value: string): string {
    if (value !== this.lastValue || !this.lastResult) {
      this.lastValue = value;
      const locale = this.locales[this.currentLang] || enUS;
      this.lastResult = formatDistanceToNowStrict(new Date(value), {
        addSuffix: true,
        locale,
      });
    }
    return this.lastResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
