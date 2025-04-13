import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { ItemsComponent } from './pages/items/items.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { UsersComponent } from './pages/users/users.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { CategoryComponent } from './pages/category/category.component';
import { TimbreComponent } from './pages/timbre/timbre.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'items', component: ItemsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'categories', component: CategoryComponent },
      { path: 'dashboard', component: OverviewComponent },
      { path: 'timbres', component: TimbreComponent },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
