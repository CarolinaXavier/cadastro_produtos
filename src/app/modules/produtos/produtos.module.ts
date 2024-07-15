import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProdutosComponent } from './produtos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormProdutoComponent } from './components/form-produto/form-produto.component';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

const routes: Routes = [{ path: '', component: ProdutosComponent }];

@NgModule({
  declarations: [
    ProdutosComponent,
    FormProdutoComponent
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
export class ProdutosModule { }
