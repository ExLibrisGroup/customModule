import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseButtonComponent } from './base-button.component';
import { ComponentRef } from '@angular/core';
import { ButtonInfo } from 'src/app/types/buttonInfo.types';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { EntityType } from 'src/app/shared/entity-type.enum';

// @Component({

// })

const validateButtonProps = (
  buttonElement: HTMLElement,
  expectedValues: ButtonInfo
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

  expect(buttonAriaLabel).toContain(expectedValues.ariaLabel);
  expect(buttonTextSpan.textContent).toContain(expectedValues.buttonText);
  expect(iconColor).toContain(expectedValues.color);
  expect(iconName).toContain(expectedValues.icon);
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

    componentRef.setInput('ariaLabel', 'Arial Label Text!');
    componentRef.setInput('buttonText', 'Test Button Text!');
    componentRef.setInput('color', 'sys-primary');
    componentRef.setInput('icon', 'article-link-icon');
    componentRef.setInput('url', 'www.test.com');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have expected button properties', () => {
    fixture.detectChanges();
    buttonElement = fixture.nativeElement;

    validateButtonProps(buttonElement, {
      ariaLabel: 'Arial Label Text!',
      buttonText: 'Test Button Text!',
      color: 'sys-primary',
      icon: 'article-link-icon',
      url: 'www.test.com',
      buttonType: ButtonType.ArticleLink,
      entityType: EntityType.Article,
    });
  });
});
