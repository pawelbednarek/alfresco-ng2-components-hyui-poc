/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentMetadataComponent } from './components/content-metadata/content-metadata.component';
import { ContentMetadataCardComponent } from './components/content-metadata-card/content-metadata-card.component';
import { TagModule } from '../tag/tag.module';
import { CategoriesModule } from '../category/category.module';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { ContentMetadataHeaderComponent } from './components/content-metadata/content-metadata-header.component';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CoreModule,
        TagModule,
        CategoriesModule,
        ExtensionsModule
    ],
    exports: [
        ContentMetadataComponent,
        ContentMetadataCardComponent
    ],
    declarations: [
        ContentMetadataComponent,
        ContentMetadataCardComponent,
        ContentMetadataHeaderComponent
    ]
})
export class ContentMetadataModule {}
