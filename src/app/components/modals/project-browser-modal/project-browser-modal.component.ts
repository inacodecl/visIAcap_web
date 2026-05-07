import { Component, Input, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonContent, IonHeader, IonIcon, IonSpinner, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, globeOutline, closeOutline, refreshOutline, openOutline, alertCircleOutline } from 'ionicons/icons';
import { ExternalTabService } from 'src/app/core/services/external-tab.service';

@Component({
  selector: 'app-project-browser-modal',
  templateUrl: './project-browser-modal.component.html',
  styleUrls: ['./project-browser-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonIcon, IonSpinner]
})
export class ProjectBrowserModalComponent implements OnInit, OnDestroy {
  @Input() url!: string;
  @Input() projectTitle: string = 'Proyecto';

  private modalCtrl = inject(ModalController);
  private sanitizer = inject(DomSanitizer);
  private externalTabService = inject(ExternalTabService);

  // Signals para evitar error NG0100 y mejorar reactividad
  safeUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal(true);
  showFallback = signal(false);
  
  private timeoutId: any;

  constructor() {
    addIcons({ arrowBackOutline, globeOutline, closeOutline, refreshOutline, openOutline, alertCircleOutline });
  }

  ngOnInit() {
    if (this.url) {
      this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.url));
      
      // Iniciar temporizador de respaldo (7 segundos)
      // Si el iframe no carga en este tiempo, es probable que esté bloqueado
      this.timeoutId = setTimeout(() => {
        if (this.isLoading()) {
          this.showFallback.set(true);
        }
      }, 7000);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  onIframeLoad() {
    this.isLoading.set(false);
    this.showFallback.set(false);
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  close() {
    this.safeUrl.set(null);
    this.modalCtrl.dismiss();
  }

  refresh() {
    const currentUrl = this.url;
    this.safeUrl.set(null);
    this.isLoading.set(true);
    this.showFallback.set(false);
    
    setTimeout(() => {
      this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(currentUrl));
    }, 100);
  }

  openInNewTab() {
    // Usamos el método original del servicio para abrir en pestaña
    this.externalTabService.openTab(this.url);
    // Opcionalmente cerramos el modal
    // this.close();
  }
}
