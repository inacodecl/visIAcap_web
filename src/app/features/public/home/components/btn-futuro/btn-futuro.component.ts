import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { rocketOutline } from 'ionicons/icons';
import { ButtonHomeComponent } from '../../../../../components/buttons/button-home/button-home.component';

@Component({
  selector: 'app-btn-futuro',
  templateUrl: './btn-futuro.component.html',
  styleUrls: ['./btn-futuro.component.scss'],
  standalone: true,
  imports: [ButtonHomeComponent]
})
export class BtnFuturoComponent {
  isActive = false;

  constructor(private router: Router) {
    addIcons({ rocketOutline });
  }

  navegar() {
    this.isActive = true;
    setTimeout(() => {
      this.isActive = false;
      this.router.navigate(['/futuro']);
    }, 400);
  }
}
