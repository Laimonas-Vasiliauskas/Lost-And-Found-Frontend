import { Component, OnInit, signal, inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CategoriesService } from '../../services/categories.service';
import { AdService } from '../../services/ads.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit, OnDestroy {
  user = signal<any>(null);
  menuOpen = signal(false);
  categories = signal<any[]>([]);
  ads = signal<any[]>([]);

  public auth = inject(AuthService);
  private categoriesService = inject(CategoriesService);
  private destroy$ = new Subject<void>();
  private adService = inject(AdService);

  ngOnInit() {
    // Iš karto kraunamos kategorijos (visad prieinamos)
    this.loadCategories();
    this.loadAds();
    
    // Stebimas vartotojas
    this.auth.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const userData = localStorage.getItem('user');
        console.log('User data from localStorage:', userData); // DEBUG
        
        const parsedUser = userData ? JSON.parse(userData) : null;
        this.user.set(parsedUser);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    this.auth.login({
      email: 'string',
      password: 'string'
    }).subscribe({
      next: (res) => {
        console.log('LOGIN OK:', res);
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.user.set(null);
    this.categories.set([]);
  }

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  loadCategories() {
    console.log('Loading categories...'); // DEBUG
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories loaded:', data); // DEBUG
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }
  loadAds() {
  this.adService.getAds().subscribe({
    next: (data) => {
      this.ads.set(data);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  
  
}

