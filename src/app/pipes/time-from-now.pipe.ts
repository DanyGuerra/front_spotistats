import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeFromNow',
  standalone: true,
})
export class TimeFromNowPipe implements PipeTransform {
  transform(date: string, language: 'es' | 'en' = 'en'): string {
    moment.locale(language);
    return moment.utc(date).fromNow();
  }
}
