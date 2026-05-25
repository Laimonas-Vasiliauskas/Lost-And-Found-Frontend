import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AdService, Ad } from '../../services/ads.service';

@Component({
  selector: 'app-edit-ad',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-ad.html',
  styleUrl: './edit-ad.css',
})
export class EditAd {
  menuOpen = false;
  unreadCount = 0;

  adId!: number;
  currentAd: Ad | null = null;

  categoryID = 1;
  type = '';
  location = '';
  title = '';
  description = '';

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adService: AdService,
    private chatService: ChatService
  ) {
    this.loadUnreadCount();

    this.adId = Number(this.route.snapshot.paramMap.get('id'));

    this.adService.getAdById(String(this.adId)).subscribe({
      next: (ad: Ad) => {
        this.currentAd = ad;

        this.categoryID = ad.categoryID ?? (ad as any).CategoryID ?? 1;
        this.type = ad.type ?? (ad as any).Type ?? '';
        this.location = ad.location ?? (ad as any).Location ?? '';
        this.title = ad.title ?? (ad as any).Title ?? '';
        this.description = ad.description ?? (ad as any).Description ?? '';

        if (ad.images?.length) {
          this.previewUrl = `https://localhost:7062/api/ads/image/${ad.images[0]}`;
        }
      },
      error: (err) => {
        console.error('Nepavyko gauti skelbimo:', err);
      }
    });
  }

  saveAd(): void {
    const updatedAd: Ad = {
      categoryID: Number(this.categoryID),
      type: this.type,
      location: this.location,
      title: this.title,
      description: this.description,
      userID: this.user?.id ?? this.user?.userID ?? this.user?.userId,
      images: this.currentAd?.images
    };

    this.adService.updateAd(this.adId, updatedAd).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Nepavyko atnaujinti skelbimo:', err);
      }
    });
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
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
}