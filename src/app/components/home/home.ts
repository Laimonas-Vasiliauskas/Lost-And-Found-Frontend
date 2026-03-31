import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private auth: AuthService) {}

  login() {
    this.auth.login({
      email: 'string',
      password: 'string'
    }).subscribe({
      next: (res) => {
        console.log('LOGIN OK:', res);
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);
      }
    });
  }

}