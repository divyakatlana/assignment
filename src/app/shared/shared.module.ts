import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [HeaderComponent,FooterComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule

  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
