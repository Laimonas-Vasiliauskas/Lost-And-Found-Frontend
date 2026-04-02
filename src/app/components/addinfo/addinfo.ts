import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdService } from '../../services/ads.service';

@Component({
  selector: 'app-addinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addinfo.html',
  styleUrl: './addinfo.css',
})
export class Addinfo implements OnInit {
  ad: any = null; // Pradinė reikšmė null
  isLoading: boolean = true; // Galima pridėti krovimosi indikatorių
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private adService: AdService
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    // Svarbu: 'id' turi sutapti su tavo route path: 'addinfo/:id'
    const idFromUrl = params.get('ID'); 
    
    console.log('Reikšmė iš URL:', idFromUrl);

    if (idFromUrl && idFromUrl !== 'undefined' && idFromUrl !== 'null') {
      this.fetchAdData(idFromUrl);
    } else {
      console.error('Klaida: ID nerastas arba yra "undefined" tekstas');
      this.errorMessage = 'Nepavyko atpažinti skelbimo ID.';
      this.isLoading = false;
    }
  });
}

  fetchAdData(id: string): void {
    this.adService.getAdById(id).subscribe({
      next: (data) => {
        this.ad = data;
        this.isLoading = false;
        console.log('Duomenys gauti:', this.ad);
      },
      error: (err) => {
        console.error('Klaida kraunant skelbimą:', err);
        this.errorMessage = 'Nepavyko užkrauti skelbimo informacijos.';
        this.isLoading = false;
      }
    });
  }
}
