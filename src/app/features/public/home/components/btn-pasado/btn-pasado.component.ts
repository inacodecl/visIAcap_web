import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons';
import { ButtonHomeComponent } from '../../../../../components/buttons/button-home/button-home.component';

@Component({
  selector: 'app-btn-pasado',
  templateUrl: './btn-pasado.component.html',
  styleUrls: ['./btn-pasado.component.scss'],
  standalone: true,
  imports: [ButtonHomeComponent]
})
export class BtnPasadoComponent {
  isActive = false;

  constructor(private router: Router) {
    addIcons({ timeOutline });
  }

  navegar() {
    this.isActive = true;
    setTimeout(() => {
      this.isActive = false;
      this.router.navigate(['/pasado']);
    }, 400);
  }
}
