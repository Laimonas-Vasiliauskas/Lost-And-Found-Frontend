import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdService } from '../../services/ads.service';
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
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private adService: AdService
  ) {}

  ngOnInit(): void {
    this.loadUserAds();
  }

loadUserAds(): void {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id || currentUser.userID || currentUser.userId;

  console.log('Current user:', currentUser);
  console.log('User ID:', userId);

  this.adService.getMyAds().subscribe({
    next: (allAds: any[]) => {
      console.log('All ads:', allAds);

      const userAds = allAds.filter(ad =>
        Number(ad.userID || ad.userId || ad.UserID) === Number(userId)
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

  public user = JSON.parse(localStorage.getItem('user') || '{}');

  get username() {
    return this.user.username || 'Guest';
  }

  get email() {
    return this.user.email || 'Guest';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
