import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { NextEpisodeService } from 'app/entities/next-episode';
import { NextEpisode } from 'app/shared/model/next-episode.model';
import * as moment from 'moment';
import { Program } from 'app/shared/model/program.model';
import { ProgramService } from 'app/entities/program';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    nextEpisodes: NextEpisode[];

    constructor(private principal: Principal, private loginModalService: LoginModalService,
        private eventManager: JhiEventManager, private nextEpisodeService: NextEpisodeService,
        private dataUtils: JhiDataUtils, private programService: ProgramService) { }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
            this.loadNextEpisodes();
        });
        this.registerAuthenticationSuccess();
    }

    public daysLeft(episodeDate) {
        return moment(episodeDate).diff(moment(), 'days');
    }

    public nextEpisode(episode: NextEpisode) {
        episode.episodeDate.add(1, 'week');
        this.programService.update(this.convertEpisodeProgram(episode))
            .subscribe(() => this.loadNextEpisodes());
    }

    public nextSeason(episode: NextEpisode) {
        episode.episodeDate.add(1, 'week');
        episode.episodeNumber = 0;
        episode.episodeSeason += 1;
        this.programService.update(this.convertEpisodeProgram(episode))
            .subscribe(() => this.loadNextEpisodes());
    }

    private convertEpisodeProgram(episode: NextEpisode): Program {
        return new Program(episode.id, episode.name, episode.imageContentType, episode.image,
            episode.episodeNumber, episode.episodeSeason, episode.episodeDate);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
                this.loadNextEpisodes();
            });
        });
    }

    private loadNextEpisodes() {
        this.nextEpisodeService.query().subscribe(res => this.nextEpisodes = res.body);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
