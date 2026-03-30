import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { authGuard } from './guards/guards';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: 'home', 
    component: Home 
  },
  { 
    path: 'register',
    component: Register 
  },
  { 
    path: 'profile', 
    component: Profile,
    canActivate: [authGuard] 
  },
  { 
    path: 'login', 
    component: Login,
    canActivate: [guestGuard]
  }
];
