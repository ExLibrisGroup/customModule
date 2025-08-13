import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowzineButtonComponent } from './browzine-button.component';
import { ComponentRef } from '@angular/core';
import { EntityType } from 'src/app/shared/entity-type.enum';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { TranslationService } from '../../services/translation.service';

// Mock for TranslationService
const mockTranslationService = {
  getTranslatedText: (key: string, fallback: string) => {
    const translations: { [key: string]: string } = {
      'LibKey.journalBrowZineWebLinkText': 'View Journal Contents',
      'LibKey.articleBrowZineWebLinkText': 'View Issue Contents',
    };
    return translations[key] || fallback;
  },
};

const createTestModule = async (translationServiceMock: any) => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [BrowzineButtonComponent, BaseButtonComponent],
    providers: [
      { provide: TranslationService, useValue: translationServiceMock },
    ],
  });
  await TestBed.compileComponents();
  return TestBed;
};

describe('BrowzineButtonComponent', () => {
  let component: BrowzineButtonComponent;
  let componentRef: ComponentRef<BrowzineButtonComponent>;
  let fixture: ComponentFixture<BrowzineButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowzineButtonComponent, BaseButtonComponent],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    });

    fixture = TestBed.createComponent(BrowzineButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have correct button properties for Article type', async () => {
    componentRef.setInput('url', 'www.test.browzine.com');
    componentRef.setInput('entityType', EntityType.Article);

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

    expect(buttonTextSpan.textContent).toContain('View Issue Contents');
    expect(buttonAriaLabel).toContain('View Issue Contents');
    expect(buttonUrl).toBe('www.test.browzine.com');
  });

  it('should have correct button properties for Journal type', async () => {
    componentRef.setInput('url', 'www.test.browzine.com');
    componentRef.setInput('entityType', EntityType.Journal);

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

    expect(buttonTextSpan.textContent).toContain('View Journal Contents');
    expect(buttonAriaLabel).toContain('View Journal Contents');
    expect(buttonUrl).toBe('www.test.browzine.com');
  });

  it('should handle empty URL gracefully', async () => {
    componentRef.setInput('url', '');
    componentRef.setInput('entityType', EntityType.Article);

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
            'LibKey.articleBrowZineWebLinkText': 'Custom Article Text',
            'LibKey.journalBrowZineWebLinkText': 'Custom Journal Text',
          };
          return customTranslations[key] || key;
        },
      };

      const testBed = await createTestModule(customMockTranslateService);
      const customFixture = testBed.createComponent(BrowzineButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.browzine.com');
      customComponentRef.setInput('entityType', EntityType.Article);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('Custom Article Text');
    });

    it('should display fallback text when custom text key is missing for Article', async () => {
      const fallbackMockTranslateService = {
        instant: (key: string) => {
          // Only provide translation for journal, not for article
          const translations: { [key: string]: string } = {
            'LibKey.journalBrowZineWebLinkText': 'View Journal Contents',
          };
          return translations[key] || key;
        },
      };

      const testBed = await createTestModule(fallbackMockTranslateService);
      const fallbackFixture = testBed.createComponent(BrowzineButtonComponent);
      const fallbackComponentRef = fallbackFixture.componentRef;

      fallbackComponentRef.setInput('url', 'www.test.browzine.com');
      fallbackComponentRef.setInput('entityType', EntityType.Article);
      fallbackFixture.autoDetectChanges();
      await fallbackFixture.whenStable();

      const fallbackButtonElement = fallbackFixture.nativeElement;
      const buttonTextSpan = fallbackButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('View Issue Contents'); // Should use fallback
    });

    it('should display fallback text when translation key is missing for Journal', async () => {
      const fallbackMockTranslateService = {
        instant: (key: string) => {
          // Only provide translation for article, not for journal
          const translations: { [key: string]: string } = {
            'LibKey.articleBrowZineWebLinkText': 'View Issue Contents',
          };
          return translations[key] || key;
        },
      };

      const testBed = await createTestModule(fallbackMockTranslateService);
      const fallbackFixture = testBed.createComponent(BrowzineButtonComponent);
      const fallbackComponentRef = fallbackFixture.componentRef;

      fallbackComponentRef.setInput('url', 'www.test.browzine.com');
      fallbackComponentRef.setInput('entityType', EntityType.Journal);
      fallbackFixture.autoDetectChanges();
      await fallbackFixture.whenStable();

      const fallbackButtonElement = fallbackFixture.nativeElement;
      const buttonTextSpan = fallbackButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('View Journal Contents'); // Should use fallback
    });

    it('should handle translation service returning empty string for Article', async () => {
      const emptyMockTranslateService = {
        instant: (key: string) => {
          return ''; // Return empty string for all translations
        },
      };

      const testBed = await createTestModule(emptyMockTranslateService);
      const customFixture = testBed.createComponent(BrowzineButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.browzine.com');
      customComponentRef.setInput('entityType', EntityType.Article);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('View Issue Contents'); // Should use fallback
    });

    it('should handle translation service returning null for Journal', async () => {
      const nullMockTranslateService = {
        instant: (key: string) => {
          return null as any; // Return null for all translations
        },
      };

      const testBed = await createTestModule(nullMockTranslateService);
      const customFixture = testBed.createComponent(BrowzineButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.browzine.com');
      customComponentRef.setInput('entityType', EntityType.Journal);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('View Journal Contents'); // Should use fallback
    });

    it('should handle translation service returning undefined for Article', async () => {
      const undefinedMockTranslateService = {
        instant: (key: string) => {
          return undefined as any; // Return undefined for all translations
        },
      };

      const testBed = await createTestModule(undefinedMockTranslateService);
      const customFixture = testBed.createComponent(BrowzineButtonComponent);
      const customComponentRef = customFixture.componentRef;

      customComponentRef.setInput('url', 'www.test.browzine.com');
      customComponentRef.setInput('entityType', EntityType.Article);
      customFixture.autoDetectChanges();
      await customFixture.whenStable();

      const customButtonElement = customFixture.nativeElement;
      const buttonTextSpan = customButtonElement.querySelector(
        '[data-testid="ti-button-text"]'
      )!;

      expect(buttonTextSpan.textContent).toContain('View Issue Contents'); // Should use fallback
    });
  });
});
