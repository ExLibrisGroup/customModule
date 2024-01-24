import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class StringUtilsService {

  constructor(private translate: TranslateService) {
  }

  public decodeAndInstantTranslate(translationId : string, interpolateParams?: NonNullable<unknown>) : string {
    return this.decode(this.translate.instant(translationId, interpolateParams));
  }

  public instantTranslate(translationId : string) : string {
    return this.translate.instant(translationId);
  }

  private decode(str : string) : string {
    return str.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });
  }
}
