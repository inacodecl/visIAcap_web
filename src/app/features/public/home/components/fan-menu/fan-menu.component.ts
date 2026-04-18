import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fan-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fan-menu.component.html',
  styleUrls: ['./fan-menu.component.scss']
})
export class FanMenuComponent {
  isOpen = signal(false);
  activeApp = signal<string | null>(null);

  toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  openApp(appName: string) {
    this.activeApp.set(appName);
    // REMOVED: this.isOpen.set(false); para que el abanico no colapse hasta presionar la X
    
    setTimeout(() => {
      this.activeApp.set(null);
    }, 2500);
  }
}
