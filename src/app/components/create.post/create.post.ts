import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  imports: [FormsModule, CommonModule],
  templateUrl: './create.post.html',
  styleUrl: './create.post.css',
})
export class CreatePost {
  formData = {
    type: '',
    category: '',
    title: '',
    description: '',
    location: '',
    image: null
  };

  constructor(private router: Router) {}

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.formData.image = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.formData.type && this.formData.category && this.formData.title) {
      console.log('Form submitted:', this.formData);
      alert('Skelbimas sėkmingai įkeltas!');
      this.resetForm();
    } else {
      alert('Prašome užpildyti visus reikalingus laukus');
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  resetForm() {
    this.formData = {
      type: '',
      category: '',
      title: '',
      description: '',
      location: '',
      image: null
    };
  }
}
