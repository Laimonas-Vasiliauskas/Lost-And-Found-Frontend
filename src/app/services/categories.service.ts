import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
    categoryID: number;
    categoryName: string;
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
    
    categoryIcons: { [key: string]: string } = {
    'Elektronika': 'assets/icons/icons8-electronics-94.png',
    'Apranga': 'assets/icons/icons8-clothes-94.png',
    'Raktai': 'assets/icons/icons8-bunch-of-keys-94.png',
    'Dokumentai': 'assets/icons/icons8-card-wallet-94.png',
    'Kita': 'assets/icons/icons8-open-box-94.png'
  };

    getIcon(name: string): string {
    return this.categoryIcons[name] || 'assets/icons/icons8-open-box-94.png';
  }
}