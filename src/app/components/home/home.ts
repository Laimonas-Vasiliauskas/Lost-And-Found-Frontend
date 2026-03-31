import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  user: any;
  menuOpen = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
  this.auth.isLoggedIn$.subscribe(() => {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  });
}

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

  logout() {
    this.auth.logout();
    this.user = null;
  }

  toggleMenu() {
  this.menuOpen = !this.menuOpen;
  }
  
}
