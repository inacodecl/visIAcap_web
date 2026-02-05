import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonProgressBar,
    IonContent, IonItem, IonLabel, IonInput, IonNote, IonTextarea, IonToggle,
    IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, ModalController, ToastController
} from '@ionic/angular/standalone';
import { HttpErrorResponse } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
    close, create, globe, people, pricetags, add, trash, images, arrowBack, arrowForward, save
} from 'ionicons/icons';
import { Proyecto, ProyectoTag, ProyectoCategoria } from '../../../../core/models/proyecto.model';
import { ProyectosService } from '../../../../core/services/proyectos.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-project-manager-create',
    templateUrl: './project-manager-create.component.html',
    styleUrls: ['./project-manager-create.component.scss'],
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonProgressBar,
        IonContent, IonItem, IonLabel, IonInput, IonNote, IonTextarea, IonToggle,
        IonGrid, IonRow, IonCol, IonSelect, IonSelectOption
    ]
})
export class ProjectManagerCreateComponent implements OnInit {
    private fb = inject(FormBuilder);
    private modalCtrl = inject(ModalController);
    private toastCtrl = inject(ToastController);
    private proyectosService = inject(ProyectosService);

    @Input() proyecto: Proyecto | null = null; // Si viene, es edición

    // UI State
    isLoading = false;
    currentStep = signal(1);
    totalSteps = 4;

    // Data Signals
    tagsList = signal<ProyectoTag[]>([]);
    categoriesList = signal<ProyectoCategoria[]>([]);

    projectForm: FormGroup = this.fb.group({
        slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
        titulo: ['', [Validators.required, Validators.maxLength(150)]],
        tipo: ['presente', Validators.required], // Nuevo campo
        resumen: [''],
        descripcion: [''],
        start_date: [''],
        end_date: [''],
        location: [''],
        image_cover_url: [''],
        url_externa: [''],
        is_published: [true],
        featured: [false],

        // Relaciones
        members: this.fb.array([]),
        images: this.fb.array([]),
        tags: [[]], // Array de IDs
        categories: [[]], // Array de IDs
        order_index: [0] // Campo faltante que causaba el error 500
    });

    constructor() {
        addIcons({
            close, create, globe, people, pricetags, add, trash, images, arrowBack, arrowForward, save
        });
    }

    ngOnInit() {
        this.loadMetadata();
        if (this.proyecto) {
            this.patchForm(this.proyecto);
        } else {
            // Default member if creating fresh
            this.addMember();
        }

        // Auto-generate slug from title
        this.projectForm.get('titulo')?.valueChanges.subscribe(value => {
            if (!this.proyecto && value) {
                const slugValues = this.generateSlug(value);
                // Solo actualizar si el usuario no ha tocado mucho el slug (opcional)
                // O simplemente sobrescribir si es creación nueva en tiempo real
                this.projectForm.patchValue({ slug: slugValues }, { emitEvent: false });
            }
        });
    }

    generateSlug(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    }

    loadMetadata() {
        this.isLoading = true;
        forkJoin({
            tags: this.proyectosService.getTags('es'),
            categories: this.proyectosService.getCategorias('es')
        }).subscribe({
            next: (results) => {
                this.tagsList.set(results.tags);
                this.categoriesList.set(results.categories);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading metadata', err);
                this.isLoading = false;
            }
        });
    }

    patchForm(p: Proyecto) {
        // Formatear fechas
        let startFormatted = '';
        let endFormatted = '';
        if (p.start_date) {
            const d = new Date(p.start_date);
            if (!isNaN(d.getTime())) startFormatted = d.toISOString().split('T')[0];
        }
        if (p.end_date) {
            const d = new Date(p.end_date);
            if (!isNaN(d.getTime())) endFormatted = d.toISOString().split('T')[0];
        }

        // Arrays
        if (p.members) {
            p.members.forEach(m => {
                this.membersArray.push(this.fb.group({
                    nombre: [m.nombre, Validators.required],
                    rol: [m.rol],
                    contacto: [m.contacto]
                }));
            });
        }

        if (p.images) {
            p.images.forEach(img => {
                this.imagesArray.push(this.fb.group({
                    url: [img.url, Validators.required],
                    tipo: [img.tipo],
                    alt_es: [img.alt_es],
                    order_index: [img.order_index]
                }));
            });
        }

        const tagIds = p.tags ? p.tags.map(t => t.id) : [];
        const catIds = p.categories ? p.categories.map(c => c.id) : [];

        this.projectForm.patchValue({
            slug: p.slug,
            titulo: p.titulo,
            tipo: p.tipo, // Patch tipo
            resumen: p.resumen,
            descripcion: p.descripcion,
            start_date: startFormatted,
            end_date: endFormatted,
            location: p.location,
            image_cover_url: p.image_cover_url,
            url_externa: p.url_externa,
            is_published: p.is_published,
            featured: p.featured,
            order_index: p.order_index, // Patch order_index
            tags: tagIds,
            categories: catIds
        });
    }

    // --- Form Arrays ---
    get membersArray() { return this.projectForm.get('members') as FormArray; }
    get imagesArray() { return this.projectForm.get('images') as FormArray; }

    addMember() {
        this.membersArray.push(this.fb.group({ nombre: ['', Validators.required], rol: [''], contacto: [''] }));
    }
    removeMember(i: number) { this.membersArray.removeAt(i); }

    addImage() {
        this.imagesArray.push(this.fb.group({
            url: ['', Validators.required], tipo: ['image'], alt_es: [''], order_index: [this.imagesArray.length]
        }));
    }
    removeImage(i: number) { this.imagesArray.removeAt(i); }

    // --- Wizard Navigation ---
    nextStep() { if (this.currentStep() < this.totalSteps) this.currentStep.update(v => v + 1); }
    prevStep() { if (this.currentStep() > 1) this.currentStep.update(v => v - 1); }
    goToStep(s: number) { this.currentStep.set(s); }
    get progress() { return this.currentStep() / this.totalSteps; }

    close(role = 'cancel') {
        this.modalCtrl.dismiss(null, role);
    }

    save() {
        if (this.projectForm.invalid) {
            this.projectForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = { ...this.projectForm.value };

        const request$ = this.proyecto
            ? this.proyectosService.updateProyecto(this.proyecto.id, formValue)
            : this.proyectosService.createProyecto(formValue);

        request$.subscribe({
            next: () => {
                this.isLoading = false;
                this.presentToast('Proyecto guardado exitosamente', 'success');
                this.modalCtrl.dismiss(true, 'confirm');
            },
            error: (err: HttpErrorResponse) => {
                console.error(err);
                this.isLoading = false;
                if (err.status === 409) {
                    this.presentToast('Error: El Slug (URL) ya existe. Intenta con otro.', 'danger');
                    // Opcional: mover al paso 1 para que el usuario lo vea
                    this.goToStep(1);
                } else {
                    this.presentToast('Ocurrió un error al guardar el proyecto', 'danger');
                }
            }
        });
    }

    async presentToast(message: string, color: 'success' | 'danger') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000,
            color,
            position: 'bottom'
        });
        await toast.present();
    }
}
