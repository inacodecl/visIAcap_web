import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { accessibilityOutline } from 'ionicons/icons';

@Component({
    selector: 'app-home-footer',
    templateUrl: './home-footer.component.html',
    styleUrls: ['./home-footer.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class HomeFooterComponent implements OnInit {

    constructor() {
        addIcons({ accessibilityOutline });
    }

    ngOnInit() { }

}
