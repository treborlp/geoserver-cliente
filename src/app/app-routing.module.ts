import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisorComponent } from './pages/visor/visor.component';

const routes: Routes = [
  {path: "", component: VisorComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
