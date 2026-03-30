import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(
  private auth: AuthService,
  private router: Router
) {}

logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
  console.log('User logged out');
}
  private user = JSON.parse(localStorage.getItem('user') || '{}');
}
