import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // TODO load dynamically from config
  private apiUrl = 'https://public-api.thirdiron.com/public/v1/libraries/322';
  private apiKey = 'dc14dee7-f4f3-4617-bd84-be027c3830c0';

  // private http = inject(HttpClient);

  constructor(private http: HttpClient) {}

  getArticle(doi: string): Observable<any> {
    const endpoint = `${
      this.apiUrl
    }/articles/doi/${doi}?include=journal,library${this.appendAccessToken()}`;

    return this.http.get(endpoint);
  }

  getJournal(issn: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/search?issns=${issn}${this.appendAccessToken()}`
    );
  }

  appendAccessToken() {
    return `&access_token=${this.apiKey}`;
  }
}
