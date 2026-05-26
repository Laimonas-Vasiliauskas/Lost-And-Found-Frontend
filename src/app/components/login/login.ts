import { Component, ChangeDetectorRef } from '@angular/core';
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
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  login() {
    this.errorMessage = '';

    const requiredFields = [
      { value: this.email, label: 'El. pašto' },
      { value: this.password, label: 'Slaptažodžio'}
    ];

    const emptyField = requiredFields.find(field => !field.value.trim());

    if (emptyField) {
      this.errorMessage = `${emptyField.label} laukelis privalomas`;
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage = 'Neteisingas el. pašto formatas';
      this.cd.detectChanges();
      return;
    }

    this.auth.login({
      email: this.email.trim(),
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
        if (err?.status === 401 || err?.status === 400) {
          this.errorMessage = 'Neteisingas el. paštas arba slaptažodis';
        } else {
          this.errorMessage = 'Prisijungti nepavyko. Bandykite dar kartą.';
        }
        this.cd.detectChanges();
      }
    });
  }
}