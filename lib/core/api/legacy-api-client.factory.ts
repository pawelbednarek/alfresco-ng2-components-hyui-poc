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

import { Injectable } from '@angular/core';
import { Constructor } from '../interface';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { ApiClientFactory } from './api-client.factory';

@Injectable()
export class LegacyClientFactory implements ApiClientFactory {
    constructor(private alfrescoApiService: AlfrescoApiService) { }

    create<T>(apiClass: Constructor<T>): T {
        return new apiClass(this.alfrescoApiService.getInstance());
    }
}
