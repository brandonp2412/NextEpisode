import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { INextEpisode } from 'app/shared/model/next-episode.model';
import * as moment from 'moment';

@Component({
    selector: 'jhi-next-episode-detail',
    templateUrl: './next-episode-detail.component.html'
})
export class NextEpisodeDetailComponent implements OnInit {
    nextEpisode: INextEpisode;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ nextEpisode }) => {
            this.nextEpisode = nextEpisode;
        });
    }

    public daysLeft(episodeDate) {
        return moment(episodeDate).diff(moment(), 'days');
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
