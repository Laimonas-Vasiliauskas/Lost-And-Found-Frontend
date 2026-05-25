import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdService } from '../../services/ads.service';
import { ChatService } from '../../services/chat.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  menuOpen = false;

  ads = signal<any[]>([]);

  unreadCount = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private adService: AdService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loadUserAds();
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

  loadUserAds(): void {

    const currentUser = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    const userId =
      currentUser.id ||
      currentUser.userID ||
      currentUser.userId;

    console.log('Current user:', currentUser);
    console.log('User ID:', userId);

    this.adService.getMyAds().subscribe({
      next: (allAds: any[]) => {

        console.log('All ads:', allAds);

        const userAds = allAds.filter(ad =>
          Number(
            ad.userID ||
            ad.userId ||
            ad.UserID
          ) === Number(userId)
        );

        console.log('Filtered user ads:', userAds);

        this.ads.set(userAds);
      },

      error: (err) => {
        console.error('Error loading ads:', err);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);

    console.log('User logged out');
  }

  public user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  get username() {
    return this.user.username || 'Guest';
  }

  get email() {
    return this.user.email || 'Guest';
  }

  get firstname() {
    return this.user.firstname || 'Guest';
  }

  get lastname() {
    return this.user.lastname || 'Guest';
  }

  get phonenumber() {
    return this.user.phonenumber || 'Guest';
  }

  get city() {
    return this.user.city || 'Guest';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  deleteAd(adId: number) {
    if (!confirm('Ar tikrai norite ištrinti šį skelbimą?')) {
      return;
    }

    this.adService.deleteAd(adId).subscribe({
      next: () => {
        console.log('Ad deleted successfully');
        this.loadUserAds(); // Reload the ads to reflect the deletion
      },
      error: (err) => {
        console.error('Error deleting ad:', err);
      }
    });
  }

}