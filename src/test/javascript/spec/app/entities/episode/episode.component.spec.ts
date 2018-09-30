/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { NextEpisodeTestModule } from '../../../test.module';
import { EpisodeComponent } from 'app/entities/episode/episode.component';
import { EpisodeService } from 'app/entities/episode/episode.service';
import { Episode } from 'app/shared/model/episode.model';

describe('Component Tests', () => {
    describe('Episode Management Component', () => {
        let comp: EpisodeComponent;
        let fixture: ComponentFixture<EpisodeComponent>;
        let service: EpisodeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [EpisodeComponent],
                providers: []
            })
                .overrideTemplate(EpisodeComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EpisodeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EpisodeService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Episode(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.episodes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
