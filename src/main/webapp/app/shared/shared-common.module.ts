import { NgModule } from '@angular/core';

import { NextEpisodeSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [NextEpisodeSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [NextEpisodeSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class NextEpisodeSharedCommonModule {}
