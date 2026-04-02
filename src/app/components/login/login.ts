import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('LOGIN OK:', res);
        console.log('RAW TOKEN:', res.token);
        console.log('RAW TOKEN JSON:', JSON.stringify(res.token));

        const cleanToken = String(res.token)
          .replace(/^Bearer\s+/i, '')
          .replace(/^"|"$/g, '')
          .trim();

        console.log('CLEAN TOKEN:', cleanToken);
        console.log('CLEAN TOKEN JSON:', JSON.stringify(cleanToken));

        localStorage.setItem('token', cleanToken);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);
      }
    });
  }
}