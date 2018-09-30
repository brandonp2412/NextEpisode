import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IEpisode } from 'app/shared/model/episode.model';
import { EpisodeService } from './episode.service';

@Component({
    selector: 'jhi-episode-update',
    templateUrl: './episode-update.component.html'
})
export class EpisodeUpdateComponent implements OnInit {
    private _episode: IEpisode;
    isSaving: boolean;
    releaseDateDp: any;

    constructor(private episodeService: EpisodeService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ episode }) => {
            this.episode = episode;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.episode.id !== undefined) {
            this.subscribeToSaveResponse(this.episodeService.update(this.episode));
        } else {
            this.subscribeToSaveResponse(this.episodeService.create(this.episode));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IEpisode>>) {
        result.subscribe((res: HttpResponse<IEpisode>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get episode() {
        return this._episode;
    }

    set episode(episode: IEpisode) {
        this._episode = episode;
    }
}
