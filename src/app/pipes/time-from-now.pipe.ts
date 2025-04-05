import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DefaultLanguage, Language } from 'src/constants/types';

@Pipe({
  name: 'timeFromNow',
  standalone: true,
})
export class TimeFromNowPipe implements PipeTransform {
  transform(date: string, language: Language = DefaultLanguage): string {
    moment.locale(language);
    return moment.utc(date).fromNow();
  }
}
