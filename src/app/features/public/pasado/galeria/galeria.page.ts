import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { GaleriaService, GaleriaImage } from '../../../../core/services/galeria.service';
import { environment } from '../../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { HomeFooterComponent } from '../../../../components/footers/home-footer/home-footer.component';
import { FanMenuComponent } from '../../home/components/fan-menu/fan-menu.component';
import { BackgroundBrilloComponent } from '../../../../components/background/brillo/background-brillo.component';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, close } from 'ionicons/icons';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    TranslateModule,
    HomeFooterComponent,
    FanMenuComponent,
    BackgroundBrilloComponent
  ]
})
export class GaleriaPage implements OnInit {
  imagenes: GaleriaImage[] = [];
  isLoading: boolean = true;
  apiUrl = environment.apiUrl.replace('/api', ''); // Para acceder a /uploads

  selectedImage: GaleriaImage | null = null;
  isModalOpen: boolean = false;

  progressHeader: number = 0;
  readonly SCROLL_RANGE = 200;

  constructor(
    private galeriaService: GaleriaService,
    private modalController: ModalController,
    private router: Router
  ) { 
    addIcons({ arrowBackOutline, close });
  }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading = true;
    this.galeriaService.getGaleria(false).subscribe({
      next: (data) => {
        this.imagenes = data.sort((a, b) => Number(a.anio || 0) - Number(b.anio || 0));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando la galería', err);
        this.isLoading = false;
      }
    });
  }

  openImage(imagen: GaleriaImage) {
    this.selectedImage = imagen;
    this.isModalOpen = true;
  }

  closeImage() {
    this.isModalOpen = false;
    this.selectedImage = null;
  }

  getImageUrl(url: string): string {
    if (!url) return 'assets/images/placeholder.jpg';
    if (url.startsWith('http')) return url;
    return `${this.apiUrl}/${url}`;
  }

  goBack() {
    this.router.navigate(['/pasado/timeline']);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    let progress = scrollTop / this.SCROLL_RANGE;
    this.progressHeader = Math.max(0, Math.min(1, progress));
  }
}
