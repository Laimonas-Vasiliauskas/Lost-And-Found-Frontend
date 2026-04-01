import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
    CategoryID: number;
    CategoryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
    private apiUrl = 'https://localhost:7062/api/Categories';

    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }
}