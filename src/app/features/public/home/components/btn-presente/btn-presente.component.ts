import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { businessOutline } from 'ionicons/icons';
import { ButtonHomeComponent } from '../../../../../components/buttons/button-home/button-home.component';

@Component({
  selector: 'app-btn-presente',
  templateUrl: './btn-presente.component.html',
  styleUrls: ['./btn-presente.component.scss'],
  standalone: true,
  imports: [ButtonHomeComponent]
})
export class BtnPresenteComponent {
  isActive = false;

  constructor(private router: Router) {
    addIcons({ businessOutline });
  }

  navegar() {
    this.isActive = true;
    setTimeout(() => {
      this.isActive = false;
      this.router.navigate(['/presente']);
    }, 400);
  }
}
