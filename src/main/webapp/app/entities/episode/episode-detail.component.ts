import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEpisode } from 'app/shared/model/episode.model';

@Component({
    selector: 'jhi-episode-detail',
    templateUrl: './episode-detail.component.html'
})
export class EpisodeDetailComponent implements OnInit {
    episode: IEpisode;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ episode }) => {
            this.episode = episode;
        });
    }

    previousState() {
        window.history.back();
    }
}
