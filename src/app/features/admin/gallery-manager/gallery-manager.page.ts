import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { GaleriaService, GaleriaImage } from '../../../core/services/galeria.service';
import { AdminImageUploadComponent } from '../components-admin/admin-image-upload/admin-image-upload.component';
import { AdminPageTitleComponent } from '../components-admin/admin-page-title/admin-page-title.component';
import { environment } from '../../../../environments/environment';
import { addIcons } from 'ionicons';
import { calendarOutline, imagesOutline, eyeOutline, eyeOffOutline, trashOutline, saveOutline, imageOutline } from 'ionicons/icons';

@Component({
  selector: 'app-gallery-manager',
  templateUrl: './gallery-manager.page.html',
  styleUrls: ['./gallery-manager.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AdminImageUploadComponent, AdminPageTitleComponent]
})
export class GalleryManagerPage implements OnInit {
  imagenes: GaleriaImage[] = [];
  isLoading = true;
  apiUrl = environment.apiUrl.replace('/api', '');
  
  newAnio: string = new Date().getFullYear().toString();
  isUploading = false;
  pendingImageUrl: string | null = null;

  constructor(
    private galeriaService: GaleriaService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ calendarOutline, imagesOutline, eyeOutline, eyeOffOutline, trashOutline, saveOutline, imageOutline });
  }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading = true;
    // En admin obtenemos todas, incluso las no visibles
    this.galeriaService.getGaleria(true).subscribe({
      next: (data: GaleriaImage[]) => {
        this.imagenes = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error', err);
        this.showToast('Error al cargar la galería', 'danger');
        this.isLoading = false;
      }
    });
  }

  onImageUploaded(url: string) {
    // La imagen se subió al servidor físico.
    // Solo extraemos la URL relativa y la guardamos en estado pendiente.
    const relativeUrl = url.replace(this.apiUrl + '/', '');
    this.pendingImageUrl = relativeUrl;
  }

  savePendingImage() {
    if (!this.pendingImageUrl) return;

    const newImage: Partial<GaleriaImage> = {
      url: this.pendingImageUrl,
      anio: this.newAnio || new Date().getFullYear().toString(),
      visible: 1,
      order_index: 0
    };

    this.isUploading = true;
    this.galeriaService.createImagen(newImage).subscribe({
      next: () => {
        this.showToast('Imagen guardada en la base de datos', 'success');
        this.pendingImageUrl = null;
        this.newAnio = new Date().getFullYear().toString();
        this.loadImages();
        this.isUploading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.showToast('Error al guardar la imagen en BD', 'danger');
        this.isUploading = false;
      }
    });
  }

  cancelPendingImage() {
    if (!this.pendingImageUrl) return;

    this.isUploading = true;
    this.galeriaService.deletePhysicalImage(this.pendingImageUrl).subscribe({
      next: () => {
        this.showToast('Imagen cancelada y borrada del servidor', 'medium');
        this.pendingImageUrl = null;
        this.isUploading = false;
      },
      error: (err: any) => {
        console.error('Error al borrar imagen física:', err);
        this.showToast('Error al limpiar la imagen', 'danger');
        // Aún así limpiamos la variable local
        this.pendingImageUrl = null;
        this.isUploading = false;
      }
    });
  }

  async toggleVisibility(imagen: GaleriaImage) {
    const newStatus = imagen.visible === 1 ? 0 : 1;
    this.galeriaService.updateImagen(imagen.id, { visible: newStatus }).subscribe({
      next: () => {
        imagen.visible = newStatus;
        this.showToast('Visibilidad actualizada', 'success');
      },
      error: () => this.showToast('Error al actualizar visibilidad', 'danger')
    });
  }

  async deleteImage(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de eliminar esta imagen de la galería? Esta acción no se puede revertir.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          role: 'destructive',
          handler: () => {
            this.galeriaService.deleteImagen(id).subscribe({
              next: () => {
                this.showToast('Imagen eliminada de la galería', 'success');
                this.loadImages();
              },
              error: () => this.showToast('Error al eliminar imagen', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  getImageUrl(url: string): string {
    if (!url) return 'assets/images/placeholder.jpg';
    if (url.startsWith('http')) return url;
    return `${this.apiUrl}/${url}`;
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
