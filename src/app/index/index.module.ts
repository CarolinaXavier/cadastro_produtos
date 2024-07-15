import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IndexComponent } from './index.component';
import { IndexRoutingModule } from './index-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CopyrightPipe } from './components/pipes/copyright.pipe';

@NgModule({
  declarations: [
    IndexComponent,
    NavbarComponent,
    CopyrightPipe
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,
    NgOptimizedImage
  ]
})
export class IndexModule { }
