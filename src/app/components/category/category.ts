import { Component, inject, signal, OnInit } from '@angular/core';
import { CategoriesService, Category as CategoryModel } from '../../services/categories.service';
import { AdService} from '../../services/ads.service'; // Tarkime, turi tokį servisą
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  menuOpen = false;
  // Signalai duomenims
  categories = signal<CategoryModel[]>([]);
  ads = signal<any[]>([]); // Skelbimų sąrašas
  selectedCategoryName = signal<string>('Visi skelbimai');

  // Servisai
  private categoriesService = inject(CategoriesService);
  private adService = inject(AdService); // Reikės susikurti/naudoti AdsService
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // 1. Užkrauname kategorijas (tavo esamas kodas)
    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories', err),
    });

    // 2. Stebime Query parametrus (?id=...)
    // Kiekvieną kartą pasikeitus ID, Angular automatiškai vykdys šį kodą
    this.route.queryParams.subscribe(params => {
      const categoryId = params['id'];
      this.loadAds(categoryId);
    });
  }

  loadAds(categoryId?: string) {
  // Patikriname: ar ID neegzistuoja, arba ar ID yra lygus "1"
  if (!categoryId || categoryId === '1') {
    
    // 1 variantas: Krauname VISUS skelbimus
    this.adService.getAds().subscribe({
      next: (data) => {
        this.ads.set(data);
        this.selectedCategoryName.set('Visi skelbimai');
      },
      error: (err) => console.error('Klaida kraunant visus skelbimus', err)
    });

  } else {
    
    // 2 variantas: Krauname specifinę kategoriją
    this.adService.getAdsByCategoryId(categoryId).subscribe({
      next: (data) => {
        this.ads.set(data);
        
        // Surandame pavadinimą iš turimų kategorijų sąrašo
        const cat = this.categories().find(c => c.categoryID === +categoryId);
        if (cat) {
          this.selectedCategoryName.set(cat.categoryName);
        }
      },
      error: (err) => console.error('Klaida kraunant kategorijos skelbimus', err)
    });
  }
}

  getCategoryIcon(name: string) {
    return this.categoriesService.getIcon(name);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  user = JSON.parse(localStorage.getItem('user') || '{}');
}
