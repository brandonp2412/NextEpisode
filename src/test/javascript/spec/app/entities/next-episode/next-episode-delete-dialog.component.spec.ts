/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { NextEpisodeTestModule } from '../../../test.module';
import { NextEpisodeDeleteDialogComponent } from 'app/entities/next-episode/next-episode-delete-dialog.component';
import { NextEpisodeService } from 'app/entities/next-episode/next-episode.service';

describe('Component Tests', () => {
    describe('NextEpisode Management Delete Component', () => {
        let comp: NextEpisodeDeleteDialogComponent;
        let fixture: ComponentFixture<NextEpisodeDeleteDialogComponent>;
        let service: NextEpisodeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NextEpisodeTestModule],
                declarations: [NextEpisodeDeleteDialogComponent]
            })
                .overrideTemplate(NextEpisodeDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(NextEpisodeDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NextEpisodeService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
