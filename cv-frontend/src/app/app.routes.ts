import { Routes } from '@angular/router';
import { CvFormComponent } from './components/cv-form/cv-form.component';
import { CvListComponent } from './components/cv-list/cv-list.component';

export const routes: Routes = [
  { path: '', component: CvListComponent },
  { path: 'add', component: CvFormComponent },
  { path: 'edit/:id', component: CvFormComponent },
];
