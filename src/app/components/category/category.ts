import { Component, inject, signal, OnInit } from '@angular/core';
import { CategoriesService, Category as CategoryModel } from '../../services/categories.service';
import { AdService } from '../../services/ads.service';
import { ChatService } from '../../services/chat.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  menuOpen = false;

  categories = signal<CategoryModel[]>([]);
  ads = signal<any[]>([]);
  selectedCategoryName = signal<string>('Visi skelbimai');

  unreadCount = 0;
  searchText = '';
  filteredAds: any[] = [];

  user = JSON.parse(localStorage.getItem('user') || '{}');

  private categoriesService = inject(CategoriesService);
  private adService = inject(AdService);
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUnreadCount();

    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => console.error('Failed to load categories', err),
    });

    this.route.queryParams.subscribe(params => {
      const categoryId = params['id'];
      this.loadAds(categoryId);
    });
  }

  loadAds(categoryId?: string): void {
    if (!categoryId || categoryId === '1') {
      this.adService.getAds().subscribe({
        next: (data) => {
          this.ads.set(data);
          this.filteredAds = data;
          this.selectedCategoryName.set('Visi skelbimai');
          this.applyFilters();
        },
        error: (err) => console.error('Klaida kraunant visus skelbimus', err)
      });
    } else {
      this.adService.getAdsByCategoryId(categoryId).subscribe({
        next: (data) => {
          this.ads.set(data);
          this.filteredAds = data;
          this.applyFilters();

          const cat = this.categories().find(c => c.categoryID === +categoryId);

          if (cat) {
            this.selectedCategoryName.set(cat.categoryName);
          }
        },
        error: (err) => console.error('Klaida kraunant kategorijos skelbimus', err)
      });
    }
  }

  applyFilters(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredAds = this.ads();
      return;
    }

    this.filteredAds = this.ads().filter(ad =>
      ad.title?.toLowerCase().includes(text)
    );
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

  getCategoryIcon(name: string): string {
    return this.categoriesService.getIcon(name);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}