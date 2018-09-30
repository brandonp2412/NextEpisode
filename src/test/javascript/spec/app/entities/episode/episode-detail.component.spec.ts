/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NextEpisodeTestModule } from '../../../test.module';
import { EpisodeDetailComponent } from 'app/entities/episode/episode-detail.component';
import { Episode } from 'app/shared/model/episode.model';

describe('Component Tests', () => {
    describe('Episode Management Detail Component', () => {
        let comp: EpisodeDetailComponent;
        let fixture: ComponentFixture<EpisodeDetailComponent>;
        const route = ({ data: of({ episode: new Episode(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [EpisodeDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(EpisodeDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EpisodeDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.episode).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
