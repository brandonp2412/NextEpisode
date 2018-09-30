/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NextEpisodeTestModule } from '../../../test.module';
import { NextEpisodeDetailComponent } from 'app/entities/next-episode/next-episode-detail.component';
import { NextEpisode } from 'app/shared/model/next-episode.model';

describe('Component Tests', () => {
    describe('NextEpisode Management Detail Component', () => {
        let comp: NextEpisodeDetailComponent;
        let fixture: ComponentFixture<NextEpisodeDetailComponent>;
        const route = ({ data: of({ nextEpisode: new NextEpisode(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [NextEpisodeDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(NextEpisodeDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(NextEpisodeDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.nextEpisode).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
