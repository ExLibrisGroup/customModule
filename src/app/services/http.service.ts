import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResult, ArticleData, JournalData } from '../types/tiData.types';

/**
 * This Service is responsible for all HTTP requests and includes some
 * helper functions for processing the returned response, error handling
 * and type guard checks
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // TODO load dynamically from config
  private apiUrl = 'https://public-api.thirdiron.com/public/v1/libraries/222'; //'https://public-api.thirdiron.com/public/v1/libraries/322';
  private apiKey = '826ba44a-4e48-48df-bbd2-cf8ee7bbb67d'; //'dc14dee7-f4f3-4617-bd84-be027c3830c0';

  constructor(private http: HttpClient) {}

  getArticle(doi: string): Observable<any> {
    const endpoint = `${
      this.apiUrl
    }/articles/doi/${doi}?include=journal,library${this.appendAccessToken()}`;

    return this.http
      .get(endpoint, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  getJournal(issn: string): Observable<any> {
    const endpoint = `${
      this.apiUrl
    }/search?issns=${issn}${this.appendAccessToken()}`;
    return this.http
      .get(endpoint, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  getUnpaywall(doi: string): Observable<HttpResponse<Object>> {
    // TODO - load from config
    // var email = browzine.unpaywallEmailAddressKey;
    const email = 'info@thirdiron.com';

    const endpoint = `https://api.unpaywall.org/v2/${doi}?email=${email}`;
    console.log('http getUnpaywall', endpoint);
    return this.http
      .get(endpoint, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  getData(response: ApiResult): ArticleData | JournalData | {} {
    let data = {};

    if (Array.isArray(response.body.data)) {
      data =
        response.body.data
          .filter(function (journal: any) {
            return journal?.browzineEnabled === true;
          })
          .pop() || [];
    } else {
      data = response.body.data;
    }

    // console.log('RESPONSE::', response);
    // console.log('DATA::', data);

    return data;
  }

  getIncludedJournal(response: ApiResult): JournalData | null {
    let journal = null;

    if (response.body.included) {
      journal = Array.isArray(response.body.included)
        ? response.body.included[0]
        : response.body.included;
    }

    return journal;
  }

  // Type Guard functions
  // TypeScript docs: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  isArticle(data: JournalData | ArticleData | {}): data is ArticleData {
    return (data as ArticleData).doi !== undefined;
  }
  isJournal(data: JournalData | ArticleData | {}): data is JournalData {
    return (data as JournalData).issn !== undefined;
  }

  private appendAccessToken() {
    return `&access_token=${this.apiKey}`;
  }

  private handleError(error: HttpErrorResponse) {
    // Return an observable with a user-facing error message.
    console.error(
      `Backend returned code ${error.status}, body was: `,
      error.error
    );

    return throwError(
      () =>
        new Error(
          'Something bad in fetching data from the TI API happened; please try again later.'
        )
    );
  }
}
