import { ButtonInfo } from '../types/buttonInfo.types';
import { SearchEntity } from '../types/searchEntity.types';

export const isOpenAccess = (entity: SearchEntity): boolean => {
  return !!entity.pnx.display.oa || false;
};

export const getTitle = (entity: SearchEntity): string => {
  return entity.pnx.display.title[0] || '';
};

export const shouldEnhance = (result: SearchEntity): boolean => {
  var validation = false;

  // if (!isFiltered(scope)) {
  if (isJournal(result) && getIssn(result)) {
    validation = true;
  }

  if (isArticle(result) && getDoi(result)) {
    validation = true;
  }

  if (isArticle(result) && !getDoi(result) && getIssn(result)) {
    validation = true;
  }
  // }

  return validation;
};

export const isArticle = (result: SearchEntity): boolean => {
  var validation = false;

  if (result && result.pnx) {
    if (result.pnx.display && result.pnx.display.type) {
      var contentType = result.pnx.display.type[0].trim().toLowerCase();

      if (contentType.indexOf('article') > -1) {
        validation = true;
      }
    }
  }

  return validation;
};

export const isJournal = (result: SearchEntity): boolean => {
  var validation = false;

  if (result && result.pnx) {
    if (result.pnx.display && result.pnx.display.type) {
      var contentType = result.pnx.display.type[0].trim().toLowerCase();

      if (contentType.indexOf('journal') > -1) {
        validation = true;
      }
    }
  }

  return validation;
};

export const getIssn = (result: SearchEntity): string => {
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

export const getDoi = (result: SearchEntity): string => {
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

// TODO - load info instead of hardcorded
export const getButtonInfo = (entity: SearchEntity): ButtonInfo => {
  return {
    ariaLabel: 'test',
    buttonText: `DOI: ${getDoi(entity)}`,
    url: 'https://libkey.io/libraries/322/articles/540512060/full-text-file?utm_source=api_193',
    icon: 'pdf-download-icon',
    color: 'sys-primary',
  };
};
