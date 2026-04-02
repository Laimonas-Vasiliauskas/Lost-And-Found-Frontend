import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdService } from '../../services/ads.service';

@Component({
  selector: 'app-addinfo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './addinfo.html',
  styleUrl: './addinfo.css',
})
export class Addinfo implements OnInit {
  ad: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Nepavyko atpažinti skelbimo ID.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.fetchAdData(id);
  }

  fetchAdData(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adService.getAdById(id).subscribe({
      next: (data) => {
        this.ad = data;
        this.isLoading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Nepavyko užkrauti skelbimo informacijos.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}