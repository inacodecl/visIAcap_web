import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home-header',
    templateUrl: './home-header.component.html',
    styleUrls: ['./home-header.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule]
})
export class HomeHeaderComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

}
