import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ad {
  adID?: number;
  userID?: number; // <-- PRIDĖK (labai svarbu)
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
  private readonly apiUrl = 'https://localhost:7062/api/Ads';

  constructor(private http: HttpClient) {}

  // Visi skelbimai
  getAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(this.apiUrl);
  }

  // VIENAS skelbimas
  getAdById(id: string): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`);
  }

  // MANO skelbimai (🔥 svarbiausias profile puslapiui)
  getMyAds(): Observable<Ad[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Ad[]>(`${this.apiUrl}/my`, { headers });
  }

  // Kurti skelbimą
  createAd(data: Ad): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }
}