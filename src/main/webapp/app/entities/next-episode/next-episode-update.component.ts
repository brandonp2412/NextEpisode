import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { INextEpisode } from 'app/shared/model/next-episode.model';
import { NextEpisodeService } from './next-episode.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-next-episode-update',
    templateUrl: './next-episode-update.component.html'
})
export class NextEpisodeUpdateComponent implements OnInit {
    private _nextEpisode: INextEpisode;
    isSaving: boolean;

    users: IUser[];
    episodeDateDp: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private nextEpisodeService: NextEpisodeService,
        private userService: UserService,
        private elementRef: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ nextEpisode }) => {
            this.nextEpisode = nextEpisode;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.nextEpisode, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.nextEpisode.id !== undefined) {
            this.subscribeToSaveResponse(this.nextEpisodeService.update(this.nextEpisode));
        } else {
            this.subscribeToSaveResponse(this.nextEpisodeService.create(this.nextEpisode));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<INextEpisode>>) {
        result.subscribe((res: HttpResponse<INextEpisode>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
    get nextEpisode() {
        return this._nextEpisode;
    }

    set nextEpisode(nextEpisode: INextEpisode) {
        this._nextEpisode = nextEpisode;
    }
}
