import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NextEpisodeSharedModule } from 'app/shared';
import {
    NextEpisodeComponent,
    NextEpisodeDetailComponent,
    NextEpisodeUpdateComponent,
    NextEpisodeDeletePopupComponent,
    NextEpisodeDeleteDialogComponent,
    nextEpisodeRoute,
    nextEpisodePopupRoute
} from './';

const ENTITY_STATES = [...nextEpisodeRoute, ...nextEpisodePopupRoute];

@NgModule({
    imports: [NextEpisodeSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        NextEpisodeComponent,
        NextEpisodeDetailComponent,
        NextEpisodeUpdateComponent,
        NextEpisodeDeleteDialogComponent,
        NextEpisodeDeletePopupComponent
    ],
    entryComponents: [NextEpisodeComponent, NextEpisodeUpdateComponent, NextEpisodeDeleteDialogComponent, NextEpisodeDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NextEpisodeNextEpisodeModule {}
