import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7062/api';

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  startConversation(adId: number) {
    return this.http.post<any>(
      `${this.apiUrl}/Conversations/start/${adId}`,
      {},
      this.getHeaders()
    );
  }

  getMessages(conversationId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/Messages/${conversationId}`,
      this.getHeaders()
    );
  }

  sendMessage(conversationId: number, text: string) {
    return this.http.post<any>(
      `${this.apiUrl}/Messages/${conversationId}`,
      { text },
      this.getHeaders()
    );
  }

  getUnreadCount() {
    return this.http.get<any>(
      `${this.apiUrl}/Conversations/unread-count`,
      this.getHeaders()
    );
  }

  getMyConversations() {
    return this.http.get<any[]>(
      `${this.apiUrl}/Conversations/my`,
      this.getHeaders()
    );
  }
}