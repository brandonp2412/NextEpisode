import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { INextEpisode } from 'app/shared/model/next-episode.model';
import { NextEpisodeService } from './next-episode.service';

@Component({
    selector: 'jhi-next-episode-delete-dialog',
    templateUrl: './next-episode-delete-dialog.component.html'
})
export class NextEpisodeDeleteDialogComponent {
    nextEpisode: INextEpisode;

    constructor(
        private nextEpisodeService: NextEpisodeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.nextEpisodeService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'nextEpisodeListModification',
                content: 'Deleted an nextEpisode'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-next-episode-delete-popup',
    template: ''
})
export class NextEpisodeDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ nextEpisode }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(NextEpisodeDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.nextEpisode = nextEpisode;
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
