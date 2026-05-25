import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);

  conversationId!: number;

  messages = signal<any[]>([]);

  newMessage = '';

  ngOnInit(): void {

    this.conversationId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadMessages();
  }

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
}