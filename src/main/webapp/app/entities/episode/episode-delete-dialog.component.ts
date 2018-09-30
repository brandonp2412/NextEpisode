import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEpisode } from 'app/shared/model/episode.model';
import { EpisodeService } from './episode.service';

@Component({
    selector: 'jhi-episode-delete-dialog',
    templateUrl: './episode-delete-dialog.component.html'
})
export class EpisodeDeleteDialogComponent {
    episode: IEpisode;

    constructor(private episodeService: EpisodeService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.episodeService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'episodeListModification',
                content: 'Deleted an episode'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-episode-delete-popup',
    template: ''
})
export class EpisodeDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ episode }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EpisodeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.episode = episode;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
