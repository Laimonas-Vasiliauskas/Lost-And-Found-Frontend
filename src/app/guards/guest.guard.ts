import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const guestGuard = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) {
    return true;
    }

    router.navigate(['/profile']);
    return false;
};