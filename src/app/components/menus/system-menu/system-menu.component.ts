import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-system-menu',
  templateUrl: './system-menu.component.html',
  styleUrls: ['./system-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class SystemMenuComponent {
  private popoverCtrl = inject(PopoverController);

  dismissWith(action: 'theme' | 'language' | 'developers' | 'login') {
    this.popoverCtrl.dismiss(action);
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }
}
