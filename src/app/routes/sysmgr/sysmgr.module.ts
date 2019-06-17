import { NgModule } from '@angular/core';
import { SysMgrRoutingModule } from './sysmgr-routing.module';
import { SharedModule } from '@shared';

import { UserIndexComponent } from './user/user-index.component';
import { UserFormComponent } from './user/user-form.component';

import { RoleIndexComponent } from './role/role-index.component';
import { RoleFormComponent } from './role/role-form.component';

import { MenuIndexComponent } from './menu/menu-index.component';
import { MenuFormComponent } from './menu/menu-form.component';

const COMPONENTS = [
  UserIndexComponent,
  UserFormComponent,
  RoleIndexComponent,
  RoleFormComponent,
  MenuIndexComponent,
  MenuFormComponent,
];

const COMPONENTS_NOROUNT = [UserFormComponent, RoleFormComponent, MenuFormComponent];

@NgModule({
  imports: [SharedModule, SysMgrRoutingModule],
  declarations: [...COMPONENTS],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SysMgrModule {}
