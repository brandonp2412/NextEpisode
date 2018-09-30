/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProgramComponentsPage, ProgramDeleteDialog, ProgramUpdatePage } from './program.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Program e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let programUpdatePage: ProgramUpdatePage;
    let programComponentsPage: ProgramComponentsPage;
    let programDeleteDialog: ProgramDeleteDialog;
    const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Programs', async () => {
        await navBarPage.goToEntity('program');
        programComponentsPage = new ProgramComponentsPage();
        expect(await programComponentsPage.getTitle()).to.eq('Programs');
    });

    it('should load create Program page', async () => {
        await programComponentsPage.clickOnCreateButton();
        programUpdatePage = new ProgramUpdatePage();
        expect(await programUpdatePage.getPageTitle()).to.eq('Create or edit a Program');
        await programUpdatePage.cancel();
    });

    it('should create and save Programs', async () => {
        const nbButtonsBeforeCreate = await programComponentsPage.countDeleteButtons();

        await programComponentsPage.clickOnCreateButton();
        await programUpdatePage.setNameInput('name');
        expect(await programUpdatePage.getNameInput()).to.eq('name');
        await programUpdatePage.setImageInput(absolutePath);
        await programUpdatePage.setEpisodeNumberInput('5');
        expect(await programUpdatePage.getEpisodeNumberInput()).to.eq('5');
        await programUpdatePage.setEpisodeSeasonInput('5');
        expect(await programUpdatePage.getEpisodeSeasonInput()).to.eq('5');
        await programUpdatePage.setEpisodeDateInput('2000-12-31');
        expect(await programUpdatePage.getEpisodeDateInput()).to.eq('2000-12-31');
        await programUpdatePage.save();
        expect(await programUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await programComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Program', async () => {
        const nbButtonsBeforeDelete = await programComponentsPage.countDeleteButtons();
        await programComponentsPage.clickOnLastDeleteButton();

        programDeleteDialog = new ProgramDeleteDialog();
        expect(await programDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Program?');
        await programDeleteDialog.clickOnConfirmButton();

        expect(await programComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
