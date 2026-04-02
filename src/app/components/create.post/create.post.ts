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

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  uploadImage(token: string, adId: number) {
    const formData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('adId', adId.toString());

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<{ imageUrl: string }>(
      'https://localhost:7062/api/ads/upload',
      formData,
      { headers }
    );
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

    this.http.post<any>('https://localhost:7062/api/ads', body, { headers })
      .subscribe({
        next: (adRes) => {
          console.log('Skelbimas sukurtas:', adRes);

          const adId = adRes.adID;

          if (this.selectedFile) {
            this.uploadImage(token, adId).subscribe({
              next: (uploadRes) => {
                console.log('Nuotrauka įkelta:', uploadRes);
                alert('Skelbimas su nuotrauka sukurtas!');

                this.categoryID = 1;
                this.type = '';
                this.location = '';
                this.title = '';
                this.description = '';
                this.selectedFile = null;
                this.previewUrl = null;
              },
              error: (err) => {
                console.error('Klaida įkeliant nuotrauką:', err);
              }
            });
          } else {
            alert('Skelbimas sukurtas!');
          }
        },
        error: (err) => {
          console.error('Klaida kuriant skelbimą:', err);
        }
      });
  }
}