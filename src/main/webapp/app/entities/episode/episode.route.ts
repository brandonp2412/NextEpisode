import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Episode } from 'app/shared/model/episode.model';
import { EpisodeService } from './episode.service';
import { EpisodeComponent } from './episode.component';
import { EpisodeDetailComponent } from './episode-detail.component';
import { EpisodeUpdateComponent } from './episode-update.component';
import { EpisodeDeletePopupComponent } from './episode-delete-dialog.component';
import { IEpisode } from 'app/shared/model/episode.model';

@Injectable({ providedIn: 'root' })
export class EpisodeResolve implements Resolve<IEpisode> {
    constructor(private service: EpisodeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((episode: HttpResponse<Episode>) => episode.body));
        }
        return of(new Episode());
    }
}

export const episodeRoute: Routes = [
    {
        path: 'episode',
        component: EpisodeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Episodes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'episode/:id/view',
        component: EpisodeDetailComponent,
        resolve: {
            episode: EpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Episodes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'episode/new',
        component: EpisodeUpdateComponent,
        resolve: {
            episode: EpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Episodes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'episode/:id/edit',
        component: EpisodeUpdateComponent,
        resolve: {
            episode: EpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Episodes'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const episodePopupRoute: Routes = [
    {
        path: 'episode/:id/delete',
        component: EpisodeDeletePopupComponent,
        resolve: {
            episode: EpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Episodes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
