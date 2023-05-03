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

import { TestBed, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
    setupTestBed,
    NotificationService,
    AppConfigService
} from '@alfresco/adf-core';
import { NodesApiService } from '../common/services/nodes-api.service';
import { RenditionService } from '../common/services/rendition.service';

import { SharedLinksApiService } from './services/shared-links-api.service';
import { ShareDialogComponent } from './content-node-share.dialog';
import moment from 'moment';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ShareDialogComponent', () => {
    let node;
    let matDialog: MatDialog;
    const notificationServiceMock = {
        openSnackMessage: jasmine.createSpy('openSnackMessage')
    };
    let sharedLinksApiService: SharedLinksApiService;
    let renditionService: RenditionService;
    let nodesApiService: NodesApiService;
    let fixture: ComponentFixture<ShareDialogComponent>;
    let component: ShareDialogComponent;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            {provide: NotificationService, useValue: notificationServiceMock},
            {
                provide: MatDialogRef, useValue: {
                    close: () => {
                    }
                }
            },
            {provide: MAT_DIALOG_DATA, useValue: {}}
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShareDialogComponent);
        component = fixture.componentInstance;
        component.maxDebounceTime = 0;

        matDialog = TestBed.inject(MatDialog);
        sharedLinksApiService = TestBed.inject(SharedLinksApiService);
        renditionService = TestBed.inject(RenditionService);
        nodesApiService = TestBed.inject(NodesApiService);
        appConfigService = TestBed.inject(AppConfigService);

        node = {
            entry: {
                id: 'nodeId',
                allowableOperations: ['update'],
                isFile: true,
                properties: {}
            }
        };

        spyOn(nodesApiService, 'updateNode').and.returnValue(of(null));
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Error Handling', () => {
        it('should emit a generic error when unshare fails', (done) => {
            spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(
                of(new Error(`{ "error": { "statusCode": 999 } }`))
            );

            const sub = sharedLinksApiService.error.subscribe((err) => {
                expect(err.statusCode).toBe(999);
                expect(err.message).toBe('SHARE.UNSHARE_ERROR');
                sub.unsubscribe();
                done();
            });

            component.deleteSharedLink('guid');
        });

        it('should emit permission error when unshare fails', (done) => {
            spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(
                of(new Error(`{ "error": { "statusCode": 403 } }`))
            );

            const sub = sharedLinksApiService.error.subscribe((err) => {
                expect(err.statusCode).toBe(403);
                expect(err.message).toBe('SHARE.UNSHARE_PERMISSION_ERROR');
                sub.unsubscribe();
                done();
            });

            component.deleteSharedLink('guid');
        });
    });

    it(`should toggle share action when property 'sharedId' does not exists`, () => {
        spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of({
            entry: {id: 'sharedId', sharedId: 'sharedId'}
        }));
        spyOn(renditionService, 'getNodeRendition').and.returnValue(Promise.resolve({url: '', mimeType: ''}));

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalled();
        expect(renditionService.getNodeRendition).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]').value).toBe('some-url/sharedId');
        expect(fixture.nativeElement.querySelector('[data-automation-id="adf-share-toggle"]').classList).toContain('mat-checked');
    });

    it(`should not toggle share action when file has 'sharedId' property`, async () => {
        spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of({
            entry: {id: 'sharedId', sharedId: 'sharedId'}
        }));
        spyOn(renditionService, 'getNodeRendition').and.returnValue(Promise.resolve({url: '', mimeType: ''}));

        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(sharedLinksApiService.createSharedLinks).not.toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]').value).toBe('some-url/sharedId');
        expect(fixture.nativeElement.querySelector('[data-automation-id="adf-share-toggle"]').classList).toContain('mat-checked');
    });

    it('should open a confirmation dialog when unshare button is triggered', () => {
        spyOn(matDialog, 'open').and.returnValue({beforeClosed: () => of(false)} as any);
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();

        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement.querySelector('[data-automation-id="adf-share-toggle"] label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(matDialog.open).toHaveBeenCalled();
    });

    it('should unshare file when confirmation dialog returns true', fakeAsync(() => {
        spyOn(matDialog, 'open').and.returnValue({beforeClosed: () => of(true)} as any);
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement.querySelector('[data-automation-id="adf-share-toggle"] label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
    }));

    it('should not unshare file when confirmation dialog returns false', fakeAsync(() => {
        spyOn(matDialog, 'open').and.returnValue({beforeClosed: () => of(false)} as any);
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement.querySelector('[data-automation-id="adf-share-toggle"] label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(sharedLinksApiService.deleteSharedLink).not.toHaveBeenCalled();
    }));

    it('should not allow unshare when node has no update permission', () => {
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.allowableOperations = [];

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();
        const slideToggleChecked: HTMLDivElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-slide-toggle-checked"]');

        expect(slideToggleChecked).toBe(null);
        expect(fixture.nativeElement.querySelector('[data-automation-id="adf-share-toggle"]').classList).toContain('mat-disabled');
        // expect(fixture.nativeElement.querySelector('input[formcontrolname="time"]').disabled).toBe(true);
        // expect(fixture.nativeElement.querySelector('mat-datetimepicker-toggle button').disabled).toBe(true);
    });

    it('should delete the current link generated with expiry date and generate a new link without expiry date when toggle is unchecked', async () => {
        spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of());
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));
        spyOn(renditionService, 'getNodeRendition');

        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.properties['qshare:sharedId'] = '2017-04-15T18:31:37+00:00';
        node.entry.allowableOperations = ['update'];
        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };


        fixture.detectChanges();

        component.form.controls['time'].setValue(moment());

        fixture.detectChanges();

        fixture.nativeElement
            .querySelector('.mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        await fixture.whenStable();

        expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
        expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalledWith('nodeId');

    });

    it('should not allow expiration date action when node has no update permission', async () => {
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.allowableOperations = [];

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();
        await fixture.whenStable();

        const slideToggleChecked: HTMLDivElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-slide-toggle-checked"]');

        expect(slideToggleChecked).toBe(null);
        // expect(fixture.nativeElement.querySelector('input[formcontrolname="time"]').disabled).toBe(true);
        expect(fixture.nativeElement.querySelector('.mat-slide-toggle[data-automation-id="adf-expire-toggle"]')
            .classList).toContain('mat-disabled');
    });


    describe('datetimepicker type', () => {
        beforeEach(() => {
            spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of());
            spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));
            spyOn(renditionService, 'getNodeRendition');

            node.entry.properties['qshare:sharedId'] = 'sharedId';
            node.entry.allowableOperations = ['update'];
            component.data = {
                node,
                baseShareUrl: 'some-url/'
            };
        });

        it('it should update node with input date and end of day time when type is `date`', fakeAsync(() => {
            const dateTimePickerType = 'date';
            const date = moment('2525-01-01 13:00:00');
            spyOn(appConfigService, 'get').and.callFake(() => dateTimePickerType as any);

            fixture.detectChanges();
            fixture.nativeElement.querySelector('mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
                .dispatchEvent(new MouseEvent('click'));

            fixture.componentInstance.time.setValue(date);
            fixture.detectChanges();
            tick(500);

            let expiryDate = date.endOf('day').utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            const lastIndex = expiryDate?.lastIndexOf(':');
            expiryDate = expiryDate?.substring(0, lastIndex) + expiryDate?.substring(lastIndex + 1, expiryDate?.length);

            expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
            expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalledWith({
                nodeId: 'nodeId',
                expiresAt: expiryDate
            });
        }));

        it('it should update node with input date and time when type is `datetime`', fakeAsync (() => {
            const dateTimePickerType = 'datetime';
            const date = moment('2525-01-01 13:00:00');
            spyOn(appConfigService, 'get').and.returnValue(dateTimePickerType);

            fixture.detectChanges();
            fixture.nativeElement.querySelector('mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
                .dispatchEvent(new MouseEvent('click'));

            fixture.componentInstance.time.setValue(date);
            fixture.detectChanges();
            tick(100);

            let expiryDate = date.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            const lastIndex = expiryDate?.lastIndexOf(':');
            expiryDate = expiryDate?.substring(0, lastIndex) + expiryDate?.substring(lastIndex + 1, expiryDate?.length);

            expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
            expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalledWith({
                nodeId: 'nodeId',
                expiresAt: expiryDate
            });
        }));
    });
});
