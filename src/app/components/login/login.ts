import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(private auth: AuthService) {}

  login() {
    this.auth.login({
      email: this.email,
      password: this.password
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