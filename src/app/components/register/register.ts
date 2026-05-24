import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [FormsModule, RouterModule],
  styleUrl: './register.css',
})
export class Register {
  firstname = '';
  lastname = '';
  username = '';
  email = '';
  password = '';
  phonenumber ='';
  city ='';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  register() {
    this.errorMessage = '';

    const requiredFields = [
      { value: this.firstname, label: 'Vardo' },
      { value: this.lastname, label: 'Pavardės' },
      { value: this.username, label: 'Vartotojo vardo' },
      { value: this.email, label: 'El. pašto' },
      { value: this.password, label: 'Slaptažodžio' },
      { value: this.phonenumber, label: 'Tel. numerio' },
      { value: this.city, label: 'Miesto' }
    ];

    const emptyField = requiredFields.find(field => !field.value.trim());

    if (emptyField) {
      this.errorMessage = `${emptyField.label} laukelis privalomas`;
      return;
    }

    const data = {
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      email: this.email,
      password: this.password,
      phonenumber: this.phonenumber,
      city: this.city
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
