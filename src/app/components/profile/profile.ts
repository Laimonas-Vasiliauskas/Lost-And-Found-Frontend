import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  menuOpen = false;
  constructor(
  private auth: AuthService,
  private router: Router
  
  
) {}



logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
  console.log('User logged out');
}
  public user = JSON.parse(localStorage.getItem('user') || '{}');

get username() {
  return this.user.username || 'Guest';
}

get email() {
  return this.user.email || 'Guest';
}

toggleMenu() {
  this.menuOpen = !this.menuOpen;
  }
}
