import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { IonIcon, IonSpinner, IonProgressBar, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUpload, document, closeCircle } from 'ionicons/icons';
import { UploadService } from '../../../../core/services/upload.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-image-upload',
  templateUrl: './admin-image-upload.component.html',
  styleUrls: ['./admin-image-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner, IonProgressBar]
})
export class AdminImageUploadComponent {
  @Input() uploadFolder: string = 'hitos';
  @Output() imageUploaded = new EventEmitter<string>();
  
  private uploadService = inject(UploadService);
  private toastCtrl = inject(ToastController);
  
  isDragging = signal(false);
  isUploading = signal(false);
  uploadProgress = signal(0);
  
  constructor() {
    addIcons({ cloudUpload, document, closeCircle });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
    // Limpiar el input
    event.target.value = null;
  }

  private async handleFile(file: File) {
    // Validations
    if (!file.type.startsWith('image/')) {
      this.showToast('Solo se permiten archivos de imagen (JPG, PNG, WEBP).', 'danger');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('El archivo excede el límite de 5MB.', 'danger');
      return;
    }

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.uploadService.uploadImage(file, this.uploadFolder).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / event.total);
          this.uploadProgress.set(progress);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading.set(false);
          if (event.body && event.body.success) {
            // Asegurar que quitamos solo el '/api' del final y no rompemos la URL
            const baseUrl = environment.apiUrl.endsWith('/api') 
              ? environment.apiUrl.slice(0, -4) 
              : environment.apiUrl;
            const finalUrl = baseUrl + event.body.data.url;
            this.imageUploaded.emit(finalUrl);
            this.showToast('Imagen subida correctamente.', 'success');
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.isUploading.set(false);
        this.uploadProgress.set(0);
        this.showToast('Error al subir la imagen.', 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
