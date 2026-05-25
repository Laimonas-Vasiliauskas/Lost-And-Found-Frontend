import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { authGuard } from './guards/guards';
import { guestGuard } from './guards/guest.guard';
import { Category } from './components/category/category';
import { CreatePost } from './components/create.post/create.post';
import { Addinfo } from './components/addinfo/addinfo';
import { EditProfile } from './components/edit-profile/edit-profile';
import { Chat } from './components/chat/chat';
import { Inbox } from './components/inbox/inbox';
import { EditAd} from './components/edit-ad/edit-ad';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home', 
    component: Home 
  },
  {
    path: 'create-post',
    component: CreatePost,
    canActivate: [authGuard]
  },
  {
    path: 'category',
    component: Category
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
  },
  {
    path: 'addinfo/:id',
    component: Addinfo
  },
  {
    path: 'edit-profile',
    component: EditProfile
  },
  {
    path: 'chat/:id',
    component: Chat
  },
  {
    path: 'inbox',
    component: Inbox
  },
  {
    path: 'edit-ad/:id',
    component: EditAd
  }
];
