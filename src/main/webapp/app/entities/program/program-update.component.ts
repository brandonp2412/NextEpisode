import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IProgram } from 'app/shared/model/program.model';
import { ProgramService } from './program.service';
import { IEpisode } from 'app/shared/model/episode.model';
import { EpisodeService } from 'app/entities/episode';

@Component({
    selector: 'jhi-program-update',
    templateUrl: './program-update.component.html'
})
export class ProgramUpdateComponent implements OnInit {
    private _program: IProgram;
    isSaving: boolean;

    lastepisodes: IEpisode[];

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private programService: ProgramService,
        private episodeService: EpisodeService,
        private elementRef: ElementRef,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ program }) => {
            this.program = program;
        });
        this.episodeService.query({ filter: 'program-is-null' }).subscribe(
            (res: HttpResponse<IEpisode[]>) => {
                if (!this.program.lastEpisode || !this.program.lastEpisode.id) {
                    this.lastepisodes = res.body;
                } else {
                    this.episodeService.find(this.program.lastEpisode.id).subscribe(
                        (subRes: HttpResponse<IEpisode>) => {
                            this.lastepisodes = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
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
        this.dataUtils.clearInputImage(this.program, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.program.id !== undefined) {
            this.subscribeToSaveResponse(this.programService.update(this.program));
        } else {
            this.subscribeToSaveResponse(this.programService.create(this.program));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProgram>>) {
        result.subscribe((res: HttpResponse<IProgram>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackEpisodeById(index: number, item: IEpisode) {
        return item.id;
    }
    get program() {
        return this._program;
    }

    set program(program: IProgram) {
        this._program = program;
    }
}
