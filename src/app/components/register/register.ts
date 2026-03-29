import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [FormsModule]
})
export class Register {

  username = '';
  email = '';
  password = '';

  constructor(private http: HttpClient) {}

  register() {
    const data = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('https://localhost:7062/api/auth/register', data)
      .subscribe({
        next: (res) => {
          console.log('REGISTER OK', res);
          alert('Registracija sėkminga');
        },
        error: (err) => {
          console.error(err);
          alert('Klaida');
        }
      });
  }
}