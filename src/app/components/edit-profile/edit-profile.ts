import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [RouterModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  menuOpen = false;

  username = '';
  email = '';
  firstname = '';
  lastname = '';
  phonenumber = '';
  city = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.username = user.username || '';
    this.email = user.email || '';
    this.firstname = user.firstname || '';
    this.lastname = user.lastname || '';
    this.phonenumber = user.phonenumber || '';
    this.city = user.city || '';
  }

  public user = JSON.parse(localStorage.getItem('user') || '{}');

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    console.log('User logged out');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  saveProfile() {
  const updatedUser = {
    username: this.username,
    email: this.email,
    firstName: this.firstname,
    lastName: this.lastname,
    phoneNumber: this.phonenumber,
    city: this.city
  };

  this.auth.updateProfile(updatedUser).subscribe({
    next: () => {
      this.router.navigate(['/profile']);
    },
    error: (err) => {
      console.error('Nepavyko atnaujinti profilio', err);
    }
  });
  }

}
