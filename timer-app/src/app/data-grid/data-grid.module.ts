import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TimerComponent} from "./components/timer/timer.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {GridComponent} from "./components/data-grid/data-grid.component";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DataGridRoutingModule} from "./data-grid.routing.module";
import {MatInputModule} from "@angular/material/input";



@NgModule({
  declarations: [GridComponent, TimerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DataGridRoutingModule
  ]
})
export class DataGridModule { }
