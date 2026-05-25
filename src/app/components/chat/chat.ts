import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {

  public user = JSON.parse(localStorage.getItem('user') || '{}');

  menuOpen = false;

  unreadCount = signal(0);

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private destroy$ = new Subject<void>();

  conversationId!: number;

  messages = signal<any[]>([]);

  newMessage = '';

  ngOnInit(): void {
    this.loadUnreadCount();

    this.conversationId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadMessages();

    this.auth.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const userData = localStorage.getItem('user');
        console.log('User data from localStorage:', userData);

        const parsedUser = userData ? JSON.parse(userData) : null;
        this.user.set(parsedUser);

        if (parsedUser) {
          this.loadUnreadCount();
        } else {
          this.unreadCount.set(0);
        }
      });
  }

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  loadMessages() {

    this.chatService.getMessages(this.conversationId)
      .subscribe({
        next: (res: any) => {
          this.messages.set(res);
        },
        error: (err: any) => {
          console.error(err);
        }
      });
  }

  sendMessage() {

    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(
      this.conversationId,
      this.newMessage
    ).subscribe({
        next: (msg: any) => {
          this.messages.update(messages => [
            ...messages,
            msg
          ]);

          this.newMessage = '';
        },
        error: (err: any) => {
          console.error(err);
        }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    console.log('User logged out');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUnreadCount() {
      const token = localStorage.getItem('token');
  
      if (!token) {
        this.unreadCount.set(0);
        return;
      }
  
      this.chatService.getUnreadCount()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.unreadCount.set(res.unreadCount ?? 0);
          },
          error: (err: any) => {
            console.error('Unread count error:', err);
            this.unreadCount.set(0);
          }
        });
    }


}