import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainButtonComponent } from './main-button.component';
import { ComponentRef } from '@angular/core';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { IconType } from 'src/app/shared/icon-type.enum';
import { TranslateService } from '@ngx-translate/core';

// Minimal mock for TranslateService
const minimalMockTranslateService = {
  instant: (key: string) =>
    key === 'LibKey.articlePDFDownloadLinkText' ? 'Download PDF' : key,
};

const validateButtonProps = (
  buttonElement: HTMLElement,
  expectedValues: any
) => {
  const buttonTextSpan = buttonElement.querySelector(
    '[data-testid="ti-button-text"]'
  )!;
  const buttonAriaLabel = buttonElement
    .querySelector('button')
    ?.getAttribute('aria-label');
  const buttonUrl = buttonElement
    .querySelector('base-button')
    ?.getAttribute('ng-reflect-url');
  const buttonIcon = buttonElement.querySelector(
    '[data-testid="ti-svg-icon"]'
  )!;

  const iconColor = buttonIcon?.getAttribute('ng-reflect-color');
  const iconName = buttonIcon?.getAttribute('ng-reflect-name');

  expect(buttonAriaLabel).toContain(expectedValues.mainAriaLabel);
  expect(buttonTextSpan.textContent).toContain(expectedValues.mainButtonText);
  expect(iconColor).toContain(expectedValues.mainColor);
  expect(iconName).toContain(expectedValues.mainIcon);
  expect(buttonUrl).toContain(expectedValues.mainUrl);
};

describe('MainButtonComponent', () => {
  let component: MainButtonComponent;
  let componentRef: ComponentRef<MainButtonComponent>;
  let fixture: ComponentFixture<MainButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainButtonComponent, BaseButtonComponent],
      providers: [
        { provide: TranslateService, useValue: minimalMockTranslateService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MainButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have expected button properties for DirectToPDF', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.DirectToPDF);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Download PDF',
      mainButtonText: 'Download PDF',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.DirectToPDF,
    });
  });

  it('should have expected button properties for ArticleLink', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.ArticleLink);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Read Article',
      mainButtonText: 'Read Article',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleLink,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.ArticleLink,
    });
  });

  it('should have expected button properties for Document Delivery', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.DocumentDelivery);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Request PDF',
      mainButtonText: 'Request PDF',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.DocumentDelivery,
    });
  });

  it('should have expected button properties for Retraction', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.Retraction);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Retracted Article',
      mainButtonText: 'Retracted Article',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleAlert,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.Retraction,
    });
  });

  it('should have expected button properties for Expression of Concern article', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.ExpressionOfConcern);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Expression of Concern',
      mainButtonText: 'Expression of Concern',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleAlert,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.ExpressionOfConcern,
    });
  });

  it('should have expected button properties for Problematic Journal', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.ProblematicJournalArticle);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    // TODO - add values
    // validateButtonProps(buttonElement, {
    //   mainAriaLabel: 'Download PDF',
    //   mainButtonText: 'Download PDF',
    //   mainColor: 'sys-primary',
    //   mainIcon: IconType.DownloadPDF,
    //   mainUrl: 'www.test.com',
    //   mainButtonType: ButtonType.DirectToPDF,
    // });
  });

  it('should have expected button properties for Unpaywall direct to pdf', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallDirectToPDF);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    // TODO - add values
    // validateButtonProps(buttonElement, {
    //   mainAriaLabel: 'Read Article (Accepted Manuscript via Unpaywall)',
    //   mainButtonText: 'Read Article (Accepted Manuscript via Unpaywall)',
    //   mainColor: 'sys-primary',
    //   mainIcon: IconType.ArticleLink,
    //   mainUrl: 'www.test.com',
    //   mainButtonType: ButtonType.UnpaywallManuscriptLink,
    // });
  });

  it('should have expected button properties for Unpaywall article link', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallArticleLink);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    // TODO - add values
    // validateButtonProps(buttonElement, {
    //   mainAriaLabel: 'Read Article (Accepted Manuscript via Unpaywall)',
    //   mainButtonText: 'Read Article (Accepted Manuscript via Unpaywall)',
    //   mainColor: 'sys-primary',
    //   mainIcon: IconType.ArticleLink,
    //   mainUrl: 'www.test.com',
    //   mainButtonType: ButtonType.UnpaywallManuscriptLink,
    // });
  });

  it('should have expected button properties for Unpaywall manuscript pdf', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallManuscriptPDF);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    // TODO - add values
    // validateButtonProps(buttonElement, {
    //   mainAriaLabel: 'Read Article (Accepted Manuscript via Unpaywall)',
    //   mainButtonText: 'Read Article (Accepted Manuscript via Unpaywall)',
    //   mainColor: 'sys-primary',
    //   mainIcon: IconType.ArticleLink,
    //   mainUrl: 'www.test.com',
    //   mainButtonType: ButtonType.UnpaywallManuscriptLink,
    // });
  });

  it('should have expected button properties for Unpaywall manuscript link', async () => {
    componentRef.setInput('url', 'www.test.com');
    componentRef.setInput('buttonType', ButtonType.UnpaywallManuscriptLink);

    fixture.autoDetectChanges();

    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Read Article (Accepted Manuscript via Unpaywall)',
      mainButtonText: 'Read Article (Accepted Manuscript via Unpaywall)',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleLink,
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.UnpaywallManuscriptLink,
    });
  });
});
