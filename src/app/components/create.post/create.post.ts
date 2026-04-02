import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.post.html',
  styleUrl: './create.post.css',
})
export class CreatePost {
  categoryID = 1;
  type = '';
  location = '';
  title = '';
  description = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const token = localStorage.getItem('token');
    console.log('TOKEN:', token);

    if (!token) {
      console.error('Token nerastas');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      categoryID: Number(this.categoryID),
      type: this.type,
      location: this.location,
      title: this.title,
      description: this.description
    };

    this.http.post('https://localhost:7062/api/ads', body, { headers })
      .subscribe({
        next: (res) => {
          console.log('Skelbimas sukurtas:', res);
          alert('Skelbimas sukurtas!');
        },
        error: (err) => {
          console.error('Klaida:', err);
        }
      });
  }
}