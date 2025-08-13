import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleLinkButtonComponent } from './article-link-button.component';
import { ComponentRef } from '@angular/core';
import { DisplayWaterfallResponse } from 'src/app/types/displayWaterfallResponse.types';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { TranslationService } from '../../services/translation.service';

// Mock for TranslationService
const mockTranslationService = {
  getTranslatedText: (key: string, fallback: string) => {
    const translations: { [key: string]: string } = {
      'LibKey.articleLinkText': 'Read Article',
    };
    return translations[key] || fallback;
  },
};

const createTestModule = async (translationServiceMock: any) => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ArticleLinkButtonComponent, BaseButtonComponent],
    providers: [
      { provide: TranslationService, useValue: translationServiceMock },
    ],
  });
  await TestBed.compileComponents();
  return TestBed;
};

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
      imports: [ArticleLinkButtonComponent, BaseButtonComponent],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    });

    fixture = TestBed.createComponent(ArticleLinkButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show button label "Read Article"', async () => {
    componentRef.setInput('url', 'www.test.article-link.com');

    fixture.autoDetectChanges();
    buttonElement = fixture.nativeElement;

    await fixture.whenStable();

    const buttonTextSpan = buttonElement.querySelector(
      '[data-testid="ti-button-text"]'
    )!;
    expect(buttonTextSpan.textContent).toContain('Read Article');
  });

  it('should have correct button properties', async () => {
    componentRef.setInput('url', 'www.test.article-link.com');

    fixture.autoDetectChanges();
    buttonElement = fixture.nativeElement;
    await fixture.whenStable();

    const buttonTextSpan = buttonElement.querySelector(
      '[data-testid="ti-button-text"]'
    )!;
    const buttonAriaLabel = buttonElement
      .querySelector('button')
      ?.getAttribute('aria-label');
    const buttonUrl = buttonElement
      .querySelector('base-button')
      ?.getAttribute('ng-reflect-url');

    expect(buttonTextSpan.textContent).toContain('Read Article');
    expect(buttonAriaLabel).toContain('Read Article');
    expect(buttonUrl).toBe('www.test.article-link.com');
  });

  it('should handle empty URL gracefully', async () => {
    componentRef.setInput('url', '');

    fixture.autoDetectChanges();
    buttonElement = fixture.nativeElement;
    await fixture.whenStable();

    const buttonUrl = buttonElement
      .querySelector('base-button')
      ?.getAttribute('ng-reflect-url');
    expect(buttonUrl).toBe('');
  });

  describe('Custom text behavior', () => {
    it('should display custom text value when provided', async () => {
      const customMockTranslateService = {
        instant: (key: string) => {
          const customTranslations: { [key: string]: string } = {
            'LibKey.articleLinkText': 'Custom Read Article Text',
          };
          return customTranslations[key] || key;
        },
      };

      const testBed = await createTestModule(customMockTranslateService);
      const customFixture = testBed.createComponent(ArticleLinkButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.article-link.com');
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Custom Read Article Text');
    });

    it('should display fallback text when translation key is missing', async () => {
      const fallbackMockTranslateService = {
        instant: (key: string) => {
          // Don't provide any translations, should return the key
          return key;
        },
      };

      const testBed = await createTestModule(fallbackMockTranslateService);
      const fallbackFixture = testBed.createComponent(
        ArticleLinkButtonComponent
      );
      const fallbackComponentRef = fallbackFixture.componentRef;

      fallbackComponentRef.setInput('url', 'www.test.article-link.com');
      fallbackFixture.autoDetectChanges();
      await fallbackFixture.whenStable();

      const fallbackButtonElement = fallbackFixture.nativeElement;
      const buttonTextSpan = fallbackButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Read Article'); // Should use fallback
    });

    it('should handle translation service returning empty string', async () => {
      const emptyMockTranslateService = {
        instant: (key: string) => {
          return ''; // Return empty string for all translations
        },
      };

      const testBed = await createTestModule(emptyMockTranslateService);
      const customFixture = testBed.createComponent(ArticleLinkButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.article-link.com');
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Read Article'); // Should use fallback
    });

    it('should handle translation service returning null', async () => {
      const nullMockTranslateService = {
        instant: (key: string) => {
          return null as any; // Return null for all translations
        },
      };

      const testBed = await createTestModule(nullMockTranslateService);
      const customFixture = testBed.createComponent(ArticleLinkButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.article-link.com');
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Read Article'); // Should use fallback
    });

    it('should handle translation service returning undefined', async () => {
      const undefinedMockTranslateService = {
        instant: (key: string) => {
          return undefined as any; // Return undefined for all translations
        },
      };

      const testBed = await createTestModule(undefinedMockTranslateService);
      const customFixture = testBed.createComponent(ArticleLinkButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.article-link.com');
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Read Article'); // Should use fallback
    });
  });
});
