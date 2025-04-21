import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // TODO load dynamically from config
  private apiUrl = 'https://public-api.thirdiron.com/public/v1/libraries/322';
  private apiKey = 'dc14dee7-f4f3-4617-bd84-be027c3830c0';

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

  appendAccessToken() {
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
