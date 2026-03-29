import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:5001/api'; // your backend URL

  constructor(private http: HttpClient) {}

  //  GET all users
  getUsers(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/users');
  }
}