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

/* eslint-disable @angular-eslint/component-selector */

import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'multiline-text-widget',
    templateUrl: './multiline-text.widget.html',
    styleUrls: ['./multiline-text.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class MultilineTextWidgetComponentComponent extends WidgetComponent  {
    @HostBinding('style.--text-color') textColor: string;
    @HostBinding('style.--background-color') backgroundColor: string;

    constructor(public formService: FormService) {
        super(formService);

        this.textColor = this.field.params?.styles?.textColor?.rgba;
        this.backgroundColor = this.field.params?.styles?.textColor?.rgba;
    }

}
