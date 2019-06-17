import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserIndexComponent } from './user/user-index.component';
import { RoleIndexComponent } from './role/role-index.component';
import { MenuIndexComponent } from './menu/menu-index.component';

const routes: Routes = [
  {
    path: 'uindex',
    component: UserIndexComponent,
  },
  {
    path: 'rindex',
    component: RoleIndexComponent,
  },
  {
    path: 'mindex',
    component: MenuIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SysMgrRoutingModule {}
