import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css'
})
export class Inbox implements OnInit {
  private chatService = inject(ChatService);
  public user = JSON.parse(localStorage.getItem('user') || '{}');
  menuOpen = false;
  conversations = signal<any[]>([]);

  ngOnInit(): void {
    this.loadConversations();
  }

  constructor(
      private auth: AuthService,
      private router: Router
    ) {}

  loadConversations() {
    this.chatService.getMyConversations().subscribe({
      next: (res: any[]) => {
        this.conversations.set(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  openChat(conversationID: number) {
    this.router.navigate(['/chat', conversationID]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    console.log('User logged out');
  }
      
}