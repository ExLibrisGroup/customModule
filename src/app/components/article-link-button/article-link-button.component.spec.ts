import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleLinkButtonComponent } from './article-link-button.component';
import { ComponentRef } from '@angular/core';
import { DisplayWaterfallResponse } from 'src/app/types/displayWaterfallResponse.types';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { EntityType } from 'src/app/shared/entity-type.enum';

describe('ArticleLinkButtonComponent', () => {
  let component: ArticleLinkButtonComponent;
  let componentRef: ComponentRef<ArticleLinkButtonComponent>;
  let fixture: ComponentFixture<ArticleLinkButtonComponent>;
  let buttonElement: HTMLElement;

  const defaultButtonInfo: DisplayWaterfallResponse = {
    entityType: EntityType.Article,
    mainButtonType: ButtonType.ArticleLink,
    mainUrl: 'www.test.com',
    browzineUrl: 'www.browzine.com',
    showBrowzineButton: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleLinkButtonComponent],
    });

    fixture = TestBed.createComponent(ArticleLinkButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show button label "Read Article', async () => {
    componentRef.setInput('url', 'www.test.article-link.com');

    fixture.autoDetectChanges();
    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    const buttonTextSpan = buttonElement.querySelector(
      '[data-testid="ti-button-text"]'
    )!;

    expect(buttonTextSpan.textContent).toContain('Read Article');
  });
});
