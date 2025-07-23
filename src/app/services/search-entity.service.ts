import { Injectable } from '@angular/core';
import { SearchEntity } from '../types/searchEntity.types';
import { EntityType } from '../shared/entity-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SearchEntityService {
  constructor() {}

  shouldEnhance = (result: SearchEntity): boolean => {
    var validation = false;

    // if (!isFiltered(scope)) {
    if (this.isJournal(result) && this.getIssn(result)) {
      validation = true;
    }

    if (this.isArticle(result) && this.getDoi(result)) {
      validation = true;
    }

    if (
      this.isArticle(result) &&
      !this.getDoi(result) &&
      this.getIssn(result)
    ) {
      validation = true;
    }
    // }

    return validation;
  };

  isArticle = (result: SearchEntity): boolean => {
    var validation = false;

    if (result && result.pnx) {
      if (result.pnx.display && result.pnx.display.type) {
        var contentType = result.pnx.display.type[0]?.trim().toLowerCase();

        if (contentType?.indexOf('article') > -1) {
          validation = true;
        }
      }
    }

    return validation;
  };

  isJournal = (result: SearchEntity): boolean => {
    var validation = false;

    if (result && result.pnx) {
      if (result.pnx.display && result.pnx.display.type) {
        var contentType = result.pnx.display.type[0]?.trim().toLowerCase();

        if (contentType?.indexOf('journal') > -1) {
          validation = true;
        }
      }
    }

    return validation;
  };

  getIssn = (result: SearchEntity): string => {
    var issn = '';

    if (result && result.pnx && result.pnx.addata) {
      if (result.pnx.addata.issn) {
        if (result.pnx.addata.issn.length > 1) {
          issn = result.pnx.addata.issn
            .filter(function (issn) {
              return issn.length < 10 && /[\S]{4}\-[\S]{4}/.test(issn);
            })
            .join(',')
            .trim()
            .replace(/-/g, '');
        } else {
          if (result.pnx.addata.issn[0]) {
            issn = result.pnx.addata.issn[0].trim().replace('-', '');
          }
        }
      }

      if (result.pnx.addata.eissn && !issn) {
        if (result.pnx.addata.eissn.length > 1) {
          issn = result.pnx.addata.eissn
            .filter(function (issn) {
              return issn.length < 10 && /[\S]{4}\-[\S]{4}/.test(issn);
            })
            .join(',')
            .trim()
            .replace(/-/g, '');
        } else {
          if (result.pnx.addata.eissn[0]) {
            issn = result.pnx.addata.eissn[0].trim().replace('-', '');
          }
        }
      }
    }

    return encodeURIComponent(issn);
  };

  getDoi = (result: SearchEntity): string => {
    var doi = '';
    if (result && result.pnx) {
      if (result.pnx.addata && result.pnx.addata.doi) {
        if (result.pnx.addata.doi[0]) {
          doi = result.pnx.addata.doi[0].trim();
        }
      }
    }

    return encodeURIComponent(doi);
  };

  getEntityType = (entity: SearchEntity): EntityType | undefined => {
    let type = EntityType.Unknown;

    if (this.isJournal(entity) && this.getIssn(entity)) {
      return EntityType.Journal;
    }

    if (this.isArticle(entity) && this.getDoi(entity)) {
      return EntityType.Article;
    }

    if (
      this.isArticle(entity) &&
      !this.getDoi(entity) &&
      this.getIssn(entity)
    ) {
      return EntityType.Journal;
    }

    return type;
  };
}
