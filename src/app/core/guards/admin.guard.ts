import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que asegura que el usuario sea Administrador o SuperAdmin.
 * Si no cumple, redirige al home.
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificamos si es admin usando el getter del servicio
    if (authService.isAdmin) {
        return true;
    }

    // Si no tiene permisos, redirigir al home (o login-admin si se prefiere)
    console.warn('Acceso denegado: Se requieren permisos de administrador.');
    router.navigate(['/']);
    return false;
};
