import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create.post.html',
  styleUrl: './create.post.css',
})
export class CreatePost {
  menuOpen = false;
  unreadCount = 0;

  categoryID = 0;
  type = '';
  location = '';
  title = '';
  description = '';
  errorMessage = '';

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private http: HttpClient,
    private router: Router,
    private chatService: ChatService
  ) {
    this.loadUnreadCount();
  }

  loadUnreadCount(): void {
    this.chatService.getUnreadCount().subscribe({
      next: (res: any) => {
        this.unreadCount = res.unreadCount;
      },
      error: (err: any) => {
        console.error('Unread count error:', err);
      }
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
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
    this.errorMessage = '';

    const requiredFields = [
      { value: this.type, label: 'Tipo' },
      { value: this.location, label: 'Miesto' },
      { value: this.title, label: 'Pavadinimo' },
      { value: this.description, label: 'Aprašymo' }
    ];

    const emptyField = requiredFields.find(field => !field.value.trim());

    if (emptyField) {
      this.errorMessage = `${emptyField.label} laukelis privalomas`;
      return;
    }

    if (!this.categoryID) {
    this.errorMessage = 'Kategorijos laukelis privalomas';
    return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Nuotraukos laukelis privalomas';
      return;
    }

    const token = localStorage.getItem('token');

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

    this.http.post<any>('https://localhost:7062/api/Ads', body, { headers })
      .subscribe({
        next: (adRes) => {
          const adId = adRes.adID;

          if (this.selectedFile) {
            this.uploadImage(token, adId).subscribe({
              next: () => {
                alert('Skelbimas su nuotrauka sukurtas!');

                this.categoryID = 0;
                this.type = '';
                this.location = '';
                this.title = '';
                this.description = '';
                this.selectedFile = null;
                this.previewUrl = null;
                this.errorMessage = '';
              },
              error: (err) => {
                console.error('Klaida įkeliant nuotrauką:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Klaida kuriant skelbimą:', err);
        }
      });
  
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}