/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { NextEpisodeTestModule } from '../../../test.module';
import { EpisodeUpdateComponent } from 'app/entities/episode/episode-update.component';
import { EpisodeService } from 'app/entities/episode/episode.service';
import { Episode } from 'app/shared/model/episode.model';

describe('Component Tests', () => {
    describe('Episode Management Update Component', () => {
        let comp: EpisodeUpdateComponent;
        let fixture: ComponentFixture<EpisodeUpdateComponent>;
        let service: EpisodeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [EpisodeUpdateComponent]
            })
                .overrideTemplate(EpisodeUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EpisodeUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EpisodeService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Episode(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.episode = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Episode();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.episode = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
