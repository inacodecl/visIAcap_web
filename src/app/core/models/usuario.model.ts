export enum UsuarioRol {
    SuperAdmin = 'super_admin',
    Admin = 'admin'
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    /**
     * Rol del usuario en el sistema.
     * Define los permisos de acceso (RBAC).
     */
    rol: UsuarioRol;

    /**
     * Indica si el usuario está activo y puede iniciar sesión.
     * Mapeado desde tinyint(1) (0 o 1).
     */
    is_active: boolean;

    last_login_at?: Date | string;
    created_at: Date | string;
    updated_at: Date | string;

    // Nota: password_hash se excluye deliberadamente del modelo frontend por seguridad.
}
