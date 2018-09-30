import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NextEpisodeSharedModule } from 'app/shared';
import {
    ProgramComponent,
    ProgramDetailComponent,
    ProgramUpdateComponent,
    ProgramDeletePopupComponent,
    ProgramDeleteDialogComponent,
    programRoute,
    programPopupRoute
} from './';

const ENTITY_STATES = [...programRoute, ...programPopupRoute];

@NgModule({
    imports: [NextEpisodeSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProgramComponent,
        ProgramDetailComponent,
        ProgramUpdateComponent,
        ProgramDeleteDialogComponent,
        ProgramDeletePopupComponent
    ],
    entryComponents: [ProgramComponent, ProgramUpdateComponent, ProgramDeleteDialogComponent, ProgramDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NextEpisodeProgramModule {}
