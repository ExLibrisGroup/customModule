import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseButtonComponent } from './base-button.component';
import { ComponentRef } from '@angular/core';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { IconType } from 'src/app/shared/icon-type.enum';

// @Component({

// })

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
  const buttonIcon = buttonElement.querySelector(
    '[data-testid="ti-svg-icon"]'
  )!;
  const iconColor = buttonIcon?.getAttribute('ng-reflect-color');
  const iconName = buttonIcon?.getAttribute('ng-reflect-name');

  expect(buttonAriaLabel).toContain(expectedValues.mainAriaLabel);
  expect(buttonTextSpan.textContent).toContain(expectedValues.mainButtonText);
  expect(iconColor).toContain(expectedValues.mainColor);
  expect(iconName).toContain(expectedValues.mainIcon);
};

describe('BaseButtonComponent', () => {
  let component: BaseButtonComponent;
  let componentRef: ComponentRef<BaseButtonComponent>;
  let fixture: ComponentFixture<BaseButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseButtonComponent],
    });
    fixture = TestBed.createComponent(BaseButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have expected button properties for ArticleLink', () => {
    componentRef.setInput('ariaLabel', 'Arial Label Text!');
    componentRef.setInput('buttonText', 'Test Button Text!');
    componentRef.setInput('color', 'sys-primary');
    componentRef.setInput('icon', IconType.ArticleLink);
    componentRef.setInput('url', 'www.test.com');

    fixture.detectChanges();
    buttonElement = fixture.nativeElement;

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Arial Label Text!',
      mainButtonText: 'Test Button Text!',
      mainColor: 'sys-primary',
      mainIcon: 'article-link-icon',
      mainUrl: 'www.test.com',
      mainButtonType: ButtonType.ArticleLink,
      entityType: EntityType.Article,
    });
  });

  it('should have expected button properties for DirectToPDF', () => {
    componentRef.setInput('ariaLabel', 'PDF Label Text!');
    componentRef.setInput('buttonText', 'PDF Button Text!');
    componentRef.setInput('color', 'sys-primary');
    componentRef.setInput('icon', IconType.DownloadPDF);
    componentRef.setInput('url', 'www.test.com');

    fixture.detectChanges();
    buttonElement = fixture.nativeElement;

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'PDF Label Text!',
      mainButtonText: 'PDF Button Text!',
      mainColor: 'sys-primary',
      mainIcon: IconType.DownloadPDF,
      mainUrl: 'www.test.com',
    });
  });

  it('should have expected button properties for Retracted article', () => {
    componentRef.setInput('ariaLabel', 'Retracted!');
    componentRef.setInput('buttonText', 'Retracted!');
    componentRef.setInput('color', 'sys-primary');
    componentRef.setInput('icon', IconType.ArticleAlert);
    componentRef.setInput('url', 'www.test.com');

    fixture.detectChanges();
    buttonElement = fixture.nativeElement;

    validateButtonProps(buttonElement, {
      mainAriaLabel: 'Retracted!',
      mainButtonText: 'Retracted!',
      mainColor: 'sys-primary',
      mainIcon: IconType.ArticleAlert,
      mainUrl: 'www.test.com',
    });
  });
});
