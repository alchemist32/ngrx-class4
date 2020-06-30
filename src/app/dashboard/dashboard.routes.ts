import { Routes } from '@angular/router';

import { StaticsComponent } from '../entries-exits/statics/statics.component';
import { EntriesExitsComponent } from '../entries-exits/entries-exits.component';
import { DetailComponent } from '../entries-exits/detail/detail.component';

export const dashboardRoutes: Routes = [
  { path: '', component: StaticsComponent },
  { path: 'entries-exits', component: EntriesExitsComponent },
  { path: 'detail', component: DetailComponent },
];