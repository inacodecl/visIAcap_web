import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Shard {
    id: string;
    points: string;
    color: string;
    imageUrl: string;
    title: string;
    animationDelay: string; // Retraso para el efecto progresivo
}

@Component({
    selector: 'app-geometric-overlay-bottom',
    templateUrl: './geometric-overlay-bottom.component.html',
    styleUrls: ['./geometric-overlay-bottom.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class GeometricOverlayBottomComponent {

    shards: Shard[] = [
        // --- TRIÁNGULOS GRANDES (Inicio del pulso - 0s) ---
        {
            id: 'lg-1',
            points: '100,92 75,92 100,75',
            color: 'rgba(240,240,240,0.55)',
            imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop',
            title: 'Campus Renca',
            animationDelay: '0s'
        },
        {
            id: 'lg-2',
            points: '100,75 75,92 85,65 100,60',
            color: 'rgba(210,210,210,0.45)',
            imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
            title: 'Tecnología',
            animationDelay: '0.5s'
        },

        // --- TRIÁNGULOS MEDIANOS (Expansión - 0.5s - 1.5s) ---
        {
            id: 'md-1',
            points: '75,92 55,92 65,80',
            color: 'rgba(195,195,195,0.42)',
            imageUrl: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=1000&auto=format&fit=crop',
            title: 'Mecánica',
            animationDelay: '0.8s'
        },
        {
            id: 'md-2',
            points: '85,65 75,92 65,80 78,62',
            color: 'rgba(180,180,180,0.40)',
            imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
            title: 'Programación',
            animationDelay: '1.2s'
        },

        // --- TRIÁNGULOS PEQUEÑOS (Final de la estela - 1.5s - 3s) ---
        {
            id: 'sm-1',
            points: '55,92 42,92 48,86',
            color: 'rgba(220,220,220,0.48)',
            imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
            title: 'Comunidad Estudiantil',
            animationDelay: '1.5s'
        },
        {
            id: 'sm-2',
            points: '42,92 28,92 32,85 48,86',
            color: 'rgba(200,200,200,0.42)',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
            title: 'Innovación',
            animationDelay: '2.8s'
        },
        {
            id: 'sm-3',
            points: '65,80 55,92 48,86 60,76',
            color: 'rgba(175,175,175,0.36)',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
            title: 'Electrónica',
            animationDelay: '1.8s'
        },
        {
            id: 'sm-4',
            points: '100,60 92,55 100,50',
            color: 'rgba(160,160,160,0.33)',
            imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
            title: 'Construcción',
            animationDelay: '1.0s'
        },
        {
            id: 'sm-5',
            points: '92,55 85,65 78,62 88,52',
            color: 'rgba(145,145,145,0.30)',
            imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop',
            title: 'Energía',
            animationDelay: '1.4s'
        },
        {
            id: 'sm-6',
            points: '28,92 18,92 22,85 32,85',
            color: 'rgba(130,130,130,0.33)',
            imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop',
            title: 'Laboratorios',
            animationDelay: '3.0s'
        },
        {
            id: 'sm-7',
            points: '48,86 32,85 38,80 45,82',
            color: 'rgba(115,115,115,0.27)',
            imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=1000&auto=format&fit=crop',
            title: 'Robótica',
            animationDelay: '2.5s'
        },
        {
            id: 'sm-8',
            points: '60,76 48,86 45,82 55,72',
            color: 'rgba(100,100,100,0.24)',
            imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop',
            title: 'Vida Estudiantil',
            animationDelay: '2.0s'
        }
    ];

    // Objeto plano para manejar múltiples fragmentos activos (Angular detecta cambios mejor que con Set)
    activeShards: { [id: string]: boolean } = {};
    private timeouts: { [key: string]: any } = {};

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) { }

    isActive(id: string): boolean {
        return !!this.activeShards[id];
    }

    toggleShard(id: string) {
        if (this.activeShards[id]) {
            // Si ya está activo, lo cerramos y limpiamos el timeout
            this.activeShards = { ...this.activeShards };
            delete this.activeShards[id];
            if (this.timeouts[id]) {
                clearTimeout(this.timeouts[id]);
                delete this.timeouts[id];
            }
        } else {
            // Si no está activo, lo abrimos y programamos el cierre en 3s
            this.activeShards = { ...this.activeShards, [id]: true };

            // Limpiar timeout previo si existiera
            if (this.timeouts[id]) clearTimeout(this.timeouts[id]);

            // Usar ngZone.run() para garantizar que el callback se ejecute dentro de la zona de Angular
            this.timeouts[id] = setTimeout(() => {
                this.ngZone.run(() => {
                    const updated = { ...this.activeShards };
                    delete updated[id];
                    this.activeShards = updated;
                    delete this.timeouts[id];
                });
            }, 3000);
        }
    }
}
