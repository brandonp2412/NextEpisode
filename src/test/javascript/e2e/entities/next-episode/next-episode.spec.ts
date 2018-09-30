/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { NextEpisodeComponentsPage, NextEpisodeDeleteDialog, NextEpisodeUpdatePage } from './next-episode.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('NextEpisode e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let nextEpisodeUpdatePage: NextEpisodeUpdatePage;
    let nextEpisodeComponentsPage: NextEpisodeComponentsPage;
    let nextEpisodeDeleteDialog: NextEpisodeDeleteDialog;
    const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load NextEpisodes', async () => {
        await navBarPage.goToEntity('next-episode');
        nextEpisodeComponentsPage = new NextEpisodeComponentsPage();
        expect(await nextEpisodeComponentsPage.getTitle()).to.eq('Next Episodes');
    });

    it('should load create NextEpisode page', async () => {
        await nextEpisodeComponentsPage.clickOnCreateButton();
        nextEpisodeUpdatePage = new NextEpisodeUpdatePage();
        expect(await nextEpisodeUpdatePage.getPageTitle()).to.eq('Create or edit a Next Episode');
        await nextEpisodeUpdatePage.cancel();
    });

    it('should create and save NextEpisodes', async () => {
        const nbButtonsBeforeCreate = await nextEpisodeComponentsPage.countDeleteButtons();

        await nextEpisodeComponentsPage.clickOnCreateButton();
        await nextEpisodeUpdatePage.setNameInput('name');
        expect(await nextEpisodeUpdatePage.getNameInput()).to.eq('name');
        await nextEpisodeUpdatePage.setImageInput(absolutePath);
        await nextEpisodeUpdatePage.setEpisodeNumberInput('5');
        expect(await nextEpisodeUpdatePage.getEpisodeNumberInput()).to.eq('5');
        await nextEpisodeUpdatePage.setEpisodeSeasonInput('5');
        expect(await nextEpisodeUpdatePage.getEpisodeSeasonInput()).to.eq('5');
        await nextEpisodeUpdatePage.setEpisodeDateInput('2000-12-31');
        expect(await nextEpisodeUpdatePage.getEpisodeDateInput()).to.eq('2000-12-31');
        await nextEpisodeUpdatePage.save();
        expect(await nextEpisodeUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await nextEpisodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last NextEpisode', async () => {
        const nbButtonsBeforeDelete = await nextEpisodeComponentsPage.countDeleteButtons();
        await nextEpisodeComponentsPage.clickOnLastDeleteButton();

        nextEpisodeDeleteDialog = new NextEpisodeDeleteDialog();
        expect(await nextEpisodeDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Next Episode?');
        await nextEpisodeDeleteDialog.clickOnConfirmButton();

        expect(await nextEpisodeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
