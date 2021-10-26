import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { TipsComponent } from './tips/tips.component';
import { PercentComponent } from './percent/percent.component';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'tips', component: TipsComponent },
  { path: 'percent', component: PercentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
