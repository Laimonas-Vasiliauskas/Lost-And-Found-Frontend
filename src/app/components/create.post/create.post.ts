import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create.post.html',
  styleUrl: './create.post.css',
})
export class CreatePost {
  categoryID = 1;
  type = '';
  location = '';
  title = '';
  description = '';

  menuOpen = signal(false);
  user = signal<any>(null);

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  private http = inject(HttpClient);

  constructor() {
    const userData = localStorage.getItem('user');
    this.user.set(userData ? JSON.parse(userData) : null);
  }

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
    this.menuOpen.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

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