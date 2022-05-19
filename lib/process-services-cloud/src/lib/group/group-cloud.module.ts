/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule, IdentityGroupService, IDENTITY_GROUP_SERVICE_TOKEN } from '@alfresco/adf-core';
import { MaterialModule } from '../material.module';
import { GroupCloudComponent } from './components/group-cloud.component';
import { InitialGroupNamePipe } from './pipe/group-initial.pipe';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule
    ],
    providers:
	[{
		provide: IDENTITY_GROUP_SERVICE_TOKEN,
		useClass: IdentityGroupService
	}],
    declarations: [GroupCloudComponent, InitialGroupNamePipe],
    exports: [GroupCloudComponent, InitialGroupNamePipe]
})
export class GroupCloudModule { }
