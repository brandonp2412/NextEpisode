import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NextEpisodeProgramModule } from './program/program.module';
import { NextEpisodeNextEpisodeModule } from './next-episode/next-episode.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        NextEpisodeProgramModule,
        NextEpisodeNextEpisodeModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NextEpisodeEntityModule {}
