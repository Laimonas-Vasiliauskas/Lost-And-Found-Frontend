import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdService } from '../../services/ads.service';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

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
    private chatService: ChatService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

startChat() {
  const adId = this.ad.adID ?? this.ad.adId ?? this.ad.adID;

  this.chatService
    .startConversation(adId)
    .subscribe({
      next: (res: any) => {
        this.router.navigate(['/chat', res.conversationID]);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
}
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