import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Rekomenduojama apsirašyti interfeisą (modelį)
export interface Ad {
  adID?: number;
  title: string;
  description: string;
  location: string;
  type?: string;
  createdAt?: string;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  // 2. Naudok kintamąjį visoms užklausoms, kad nereikėtų kartoti viso URL
  private readonly apiUrl = 'https://localhost:7062/api/Ads';

  constructor(private http: HttpClient) {}

  // 3. Naudok Observable<Ad[]> vietoje <any[]>
  getAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(this.apiUrl);
  }

  getAdById(id: string): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`);
  }

  createAd(data: Ad): Observable<Ad> {
    const token = localStorage.getItem('token');

    // Patikra, ar tokenas egzistuoja (opcionalu, bet rekomenduojama)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Ad>(this.apiUrl, data, { headers });
  }
}