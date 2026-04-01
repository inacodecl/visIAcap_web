import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { rocketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-hero-futuro',
  templateUrl: './hero-futuro.component.html',
  styleUrls: ['./hero-futuro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslateModule]
})
export class HeroFuturoComponent implements OnInit {

  constructor() {
    addIcons({ rocketOutline });
  }

  ngOnInit() {}
}
