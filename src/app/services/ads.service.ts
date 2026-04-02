import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private apiUrl = 'https://localhost:7062/api/Ads';

  getAds() {
  return this.http.get<any[]>('https://localhost:7062/api/Ads');
}

  constructor(private http: HttpClient) {}

  createAd(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}