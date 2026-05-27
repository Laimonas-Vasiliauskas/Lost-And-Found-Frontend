import { Component, OnInit, signal, inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CategoriesService } from '../../services/categories.service';
import { AdService } from '../../services/ads.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit, OnDestroy {
  user = signal<any>(null);
  menuOpen = signal(false);
  categories = signal<any[]>([]);
  ads = signal<any[]>([]);
  filteredAds = signal<any[]>([]);

  unreadCount = signal(0);

  searchText = '';
  selectedCategoryId = '';

  public auth = inject(AuthService);
  private categoriesService = inject(CategoriesService);
  private adService = inject(AdService);
  private chatService = inject(ChatService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('HOME INIT');

    this.loadCategories();
    this.loadAds();
    this.loadUnreadCount();

    this.auth.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const userData = localStorage.getItem('user');
        console.log('User data from localStorage:', userData);

        const parsedUser = userData ? JSON.parse(userData) : null;
        this.user.set(parsedUser);

        if (parsedUser) {
          this.loadUnreadCount();
        } else {
          this.unreadCount.set(0);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUnreadCount() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.unreadCount.set(0);
      return;
    }

    this.chatService.getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.unreadCount.set(res.unreadCount ?? 0);
        },
        error: (err: any) => {
          console.error('Unread count error:', err);
          this.unreadCount.set(0);
        }
      });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  login() {
    this.auth.login({
      email: 'string',
      password: 'string'
    }).subscribe({
      next: (res) => {
        console.log('LOGIN OK:', res);
        this.loadUnreadCount();
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.user.set(null);
    this.unreadCount.set(0);
    this.loadAds();
  }

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  loadCategories() {
    console.log('Loading categories...');

    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories loaded:', data);
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadAds() {
    console.log('LOAD ADS START');

    this.adService.getAds().subscribe({
      next: (data) => {
        console.log('ADS DATA FULL:', data);
        console.log('FIRST AD:', data[0]);
        this.ads.set(data);
        this.filteredAds.set(data);
      },
      error: (err) => {
        console.error('ADS ERROR:', err);
      }
    });
  }

  applyFilters() {
    console.log('selectedCategoryId:', this.selectedCategoryId);
    console.log('all ads:', this.ads());

    const text = this.searchText.toLowerCase().trim();
    const categoryId = this.selectedCategoryId;

    const filtered = this.ads().filter(ad => {
      console.log('ad category:', ad.categoryID);

      const matchesText =
        !text ||
        String(ad.title ?? '').toLowerCase().includes(text) ||
        String(ad.description ?? '').toLowerCase().includes(text);

      const matchesCategory =
        !categoryId || String(ad.categoryID) === String(categoryId);

      return matchesText && matchesCategory;
    });

    console.log('filtered ads:', filtered);
    this.filteredAds.set(filtered);
  }

  getCategoryIcon(name: string) {
    return this.categoriesService.getIcon(name);
  }
}