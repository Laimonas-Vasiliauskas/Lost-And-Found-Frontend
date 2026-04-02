import { Component, inject, signal, OnInit } from '@angular/core';
import { CategoriesService, Category as CategoryModel } from '../../services/categories.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  imports: [RouterModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  categories = signal<CategoryModel[]>([]);
  private categoriesService = inject(CategoriesService);

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  getCategoryIcon(name: string) {
    return this.categoriesService.getIcon(name);
  }
}
