import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  openMenu() {
    this.menuOpen.set(true);
  }
}