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
  // Signalai duomenims
  categories = signal<CategoryModel[]>([]);
  ads = signal<any[]>([]); // Skelbimų sąrašas
  selectedCategoryName = signal<string>('Visi skelbimai');

  // Servisai
  private categoriesService = inject(CategoriesService);
  private adsService = inject(AdService); // Reikės susikurti/naudoti AdsService
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
    if (categoryId) {
      // Krauname konkrečios kategorijos skelbimus
      this.adsService.getAdsByCategoryId(categoryId).subscribe(data => {
        this.ads.set(data);
        // Galime atnaujinti antraštę pagal ID (surandant pavadinimą iš categories signalo)
        const cat = this.categories().find(c => c.categoryID === +categoryId);
        if (cat) this.selectedCategoryName.set(cat.categoryName);
      });
    } else {
      // Jei ID nėra, krauname visus
      this.adsService.getAds().subscribe(data => {
        this.ads.set(data);
        this.selectedCategoryName.set('Visi skelbimai');
      });
    }
  }

  getCategoryIcon(name: string) {
    return this.categoriesService.getIcon(name);
  }
}
