import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { MemberListComponent } from './member-list/member-list.component';

@NgModule({
    imports: [CommonModule, MemberRoutingModule, MemberListComponent],
})
export class MemberModule {}
