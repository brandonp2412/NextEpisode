import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NextEpisode } from 'app/shared/model/next-episode.model';
import { NextEpisodeService } from './next-episode.service';
import { NextEpisodeComponent } from './next-episode.component';
import { NextEpisodeDetailComponent } from './next-episode-detail.component';
import { NextEpisodeUpdateComponent } from './next-episode-update.component';
import { NextEpisodeDeletePopupComponent } from './next-episode-delete-dialog.component';
import { INextEpisode } from 'app/shared/model/next-episode.model';

@Injectable({ providedIn: 'root' })
export class NextEpisodeResolve implements Resolve<INextEpisode> {
    constructor(private service: NextEpisodeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((nextEpisode: HttpResponse<NextEpisode>) => nextEpisode.body));
        }
        return of(new NextEpisode());
    }
}

export const nextEpisodeRoute: Routes = [
    {
        path: 'next-episode',
        component: NextEpisodeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'NextEpisodes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'next-episode/:id/view',
        component: NextEpisodeDetailComponent,
        resolve: {
            nextEpisode: NextEpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'NextEpisodes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'next-episode/new',
        component: NextEpisodeUpdateComponent,
        resolve: {
            nextEpisode: NextEpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'NextEpisodes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'next-episode/:id/edit',
        component: NextEpisodeUpdateComponent,
        resolve: {
            nextEpisode: NextEpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'NextEpisodes'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const nextEpisodePopupRoute: Routes = [
    {
        path: 'next-episode/:id/delete',
        component: NextEpisodeDeletePopupComponent,
        resolve: {
            nextEpisode: NextEpisodeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'NextEpisodes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
