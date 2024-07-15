import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { NavPaginacaoComponent } from './components/nav-paginacao/nav-paginacao.component';
import { DinamicaImgBackgroundDirective } from './directives/dinamica-img-background.directive';
import { NotificacaoComponent } from './components/notificacao/notificacao.component';
import { AlertaComponent } from './components/notificacao/alerta/alerta.component';
import { NadaPorAquiComponent } from './components/nada-por-aqui/nada-por-aqui.component';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { CardMiniComponent } from './components/card-mini/card-mini.component';
import { ConfirmaAcaoComponent } from './components/confirma-acao/confirma-acao.component';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
};

@NgModule({
  declarations: [
    CardMiniComponent,
    ConfirmaAcaoComponent,
    NavPaginacaoComponent,
    DinamicaImgBackgroundDirective,
    NotificacaoComponent,
    AlertaComponent,
    NadaPorAquiComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    CurrencyMaskModule
  ],
  exports: [
    CardMiniComponent,
    ConfirmaAcaoComponent,
    NavPaginacaoComponent,
    DinamicaImgBackgroundDirective,
    NotificacaoComponent,
    AlertaComponent,
    NadaPorAquiComponent,
  ],
  providers: [provideNgxMask(), 
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
],
})
export class SharedModule {}
