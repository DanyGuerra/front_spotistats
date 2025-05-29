import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Language, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { LanguagesTranslation } from 'src/app/interfaces/ILanguageTranslation';
import { LocalStorage } from 'src/constants/localStorage';

@Component({
  selector: 'app-dropdown-language',
  standalone: true,
  imports: [DropdownModule, FormsModule, CommonModule],
  templateUrl: './dropdown-language.component.html',
  styleUrl: './dropdown-language.component.less',
})
export class DropdownLanguageComponent {
  langChangeSubscription: Subscription | null = null;
  languagesTranslations!: LanguagesTranslation;
  languages: any[] | undefined;
  selectedLanguage!: {
    name: string;
    code: string;
    language: Language;
  };

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    const storedLang = localStorage.getItem(LocalStorage.Language);

    if (storedLang) {
      const langObj = JSON.parse(storedLang);
      this.selectedLanguage = langObj;
    } else {
      this.selectedLanguage = { name: 'English', code: 'US', language: 'en' };
    }

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => {
        this.translateService
          .get('LANGUAGES')
          .subscribe((languagesTranslations: LanguagesTranslation) => {
            this.languagesTranslations = languagesTranslations;
          });
        this.setLanguages(this.selectedLanguage?.language);
      }
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  private setLanguages(currentLang: Language): void {
    this.languages = [
      { name: this.languagesTranslations.EN, code: 'US', language: 'en' },
      { name: this.languagesTranslations.ES, code: 'MX', language: 'es' },
    ];

    this.selectedLanguage = this.languages.find(
      (lang) => lang.language === currentLang
    );
  }

  dropdownChange(e: any) {
    this.selectedLanguage = e.value;
    this.translateService.use(e.value.language);

    localStorage.setItem(LocalStorage.Language, JSON.stringify(e.value));
  }
}
