import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GridComponent} from "./components/data-grid/data-grid.component";

const routes: Routes = [
  {
    path: '',
    component: GridComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataGridRoutingModule { }
