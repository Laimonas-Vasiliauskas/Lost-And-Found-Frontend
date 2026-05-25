import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css'
})
export class Inbox implements OnInit {
  private chatService = inject(ChatService);
  private router = inject(Router);

  conversations = signal<any[]>([]);

  ngOnInit(): void {
    this.loadConversations();
  }

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
}