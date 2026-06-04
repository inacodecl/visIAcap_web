import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FeedbackService, Feedback } from '../../../core/services/feedback.service';
import { AdminPageTitleComponent } from '../components-admin/admin-page-title/admin-page-title.component';
import { AdminEmptyStateComponent } from '../components-admin/admin-empty-state/admin-empty-state.component';
import { addIcons } from 'ionicons';
import { chatboxEllipsesOutline, trashOutline, schoolOutline, businessOutline, personOutline, filterOutline, optionsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-feedback-manager',
  templateUrl: './feedback-manager.page.html',
  styleUrls: ['./feedback-manager.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AdminPageTitleComponent, AdminEmptyStateComponent]
})
export class FeedbackManagerPage implements OnInit {
  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  isLoading = true;
  selectedFilter: 'all' | 'docente' | 'administrativo' | 'estudiante' = 'all';

  constructor(
    private feedbackService: FeedbackService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ chatboxEllipsesOutline, trashOutline, schoolOutline, businessOutline, personOutline, filterOutline, optionsOutline });
  }

  ngOnInit() {
    this.loadFeedbacks();
  }

  /**
   * Carga todos los feedbacks desde la API REST.
   */
  loadFeedbacks() {
    this.isLoading = true;
    this.feedbackService.getFeedbacks().subscribe({
      next: (response) => {
        this.feedbacks = response.data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar feedbacks:', err);
        this.showToast('Error al cargar comentarios de sugerencia', 'danger');
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica el filtro del segmento seleccionado sobre la lista local.
   */
  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredFeedbacks = [...this.feedbacks];
    } else {
      this.filteredFeedbacks = this.feedbacks.filter(f => f.rol === this.selectedFilter);
    }
  }

  /**
   * Escucha los cambios del componente Segment de Ionic.
   */
  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

  /**
   * Elimina un registro de feedback solicitando confirmación al usuario.
   */
  async deleteFeedback(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de eliminar esta sugerencia? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.feedbackService.deleteFeedback(id).subscribe({
              next: () => {
                this.showToast('Sugerencia eliminada correctamente', 'success');
                this.loadFeedbacks();
              },
              error: (err) => {
                console.error('Error al eliminar feedback:', err);
                this.showToast('Error al eliminar la sugerencia', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Retorna el icono específico del rol.
   */
  getRoleIcon(rol: string): string {
    switch (rol) {
      case 'docente': return 'school-outline';
      case 'administrativo': return 'business-outline';
      case 'estudiante': return 'person-outline';
      default: return 'chatbox-ellipses-outline';
    }
  }

  /**
   * Retorna la clase CSS del color para pintar el badge del rol.
   */
  getRoleColor(rol: string): string {
    switch (rol) {
      case 'docente': return 'warning';
      case 'administrativo': return 'secondary';
      case 'estudiante': return 'success';
      default: return 'primary';
    }
  }

  /**
   * Da formato legible a la marca de tiempo de MySQL.
   */
  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
