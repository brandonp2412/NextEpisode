import { element, by, ElementFinder } from 'protractor';

export class ProgramComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-program div table .btn-danger'));
    title = element.all(by.css('jhi-program div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getText();
    }
}

export class ProgramUpdatePage {
    pageTitle = element(by.id('jhi-program-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    imageInput = element(by.id('file_image'));
    lastEpisodeSelect = element(by.id('field_lastEpisode'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setImageInput(image) {
        await this.imageInput.sendKeys(image);
    }

    async getImageInput() {
        return this.imageInput.getAttribute('value');
    }

    async lastEpisodeSelectLastOption() {
        await this.lastEpisodeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async lastEpisodeSelectOption(option) {
        await this.lastEpisodeSelect.sendKeys(option);
    }

    getLastEpisodeSelect(): ElementFinder {
        return this.lastEpisodeSelect;
    }

    async getLastEpisodeSelectedOption() {
        return this.lastEpisodeSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class ProgramDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-program-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-program'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
