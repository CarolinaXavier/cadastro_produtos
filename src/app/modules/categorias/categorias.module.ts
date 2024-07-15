import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CategoriasComponent } from './categorias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormCategoriaComponent } from './components/form-categoria/form-categoria.component';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

const routes: Routes = [{ path: '', component: CategoriasComponent }];

@NgModule({
  declarations: [
    CategoriasComponent,
    FormCategoriaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    CurrencyMaskModule,
    SharedModule
  ]
})
export class CategoriasModule { }
