import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translate: TranslateService) {}

  /**
   * Gets translated text with fallback support
   * @param translationKey - The translation key to look up
   * @param fallbackText - Fallback text if translation is not found or equals the key
   * @returns The translated text or fallback text
   */
  getTranslatedText(translationKey: string, fallbackText: string): string {
    const translatedText = this.translate.instant(translationKey);
    return translatedText && translatedText !== translationKey
      ? translatedText
      : fallbackText;
  }

  // POSSIBLE FUTURE ADDITIONS //

  /**
   * Sets the current language
   * @param language - The language code to set
   */
  // setLanguage(language: string): void {
  //   this.translate.use(language);
  // }

  /**
   * Gets the current language
   * @returns The current language code
   */
  // getCurrentLanguage(): string {
  //   return this.translate.currentLang;
  // }

  /**
   * Gets all available languages
   * @returns Array of available language codes
   */
  // getAvailableLanguages(): string[] {
  //   return this.translate.getLangs();
  // }
}
