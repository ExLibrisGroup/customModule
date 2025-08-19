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
    providers: [{ provide: TranslationService, useValue: translationServiceMock }],
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
      providers: [{ provide: TranslationService, useValue: mockTranslationService }],
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

    const buttonTextSpan = buttonElement.querySelector('[data-testid="ti-button-text"]')!;
    const buttonAriaLabel = buttonElement.querySelector('button')?.getAttribute('aria-label');
    const buttonUrl = buttonElement.querySelector('base-button')?.getAttribute('ng-reflect-url');

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

    const buttonTextSpan = buttonElement.querySelector('[data-testid="ti-button-text"]')!;
    const buttonAriaLabel = buttonElement.querySelector('button')?.getAttribute('aria-label');
    const buttonUrl = buttonElement.querySelector('base-button')?.getAttribute('ng-reflect-url');

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

    const buttonUrl = buttonElement.querySelector('base-button')?.getAttribute('ng-reflect-url');
    expect(buttonUrl).toBe('');
  });

  describe('Custom text behavior', () => {
    it('should display custom text value when provided', async () => {
      const customMockTranslateService = {
        getTranslatedText: (key: string, fallback: string) => {
          const customTranslations: { [key: string]: string } = {
            'LibKey.articleBrowZineWebLinkText': 'Custom Article Text',
            'LibKey.journalBrowZineWebLinkText': 'Custom Journal Text',
          };
          return customTranslations[key] || fallback;
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
      const buttonTextSpan = customButtonElement.querySelector('[data-testid="ti-button-text"]')!;

      expect(buttonTextSpan.textContent).toContain('Custom Article Text');
    });

    it('should display fallback text when custom text key is missing for Article', async () => {
      const fallbackMockTranslateService = {
        getTranslatedText: (key: string, fallback: string) => {
          // Only provide translation for journal, not for article
          const translations: { [key: string]: string } = {
            'LibKey.journalBrowZineWebLinkText': 'View Journal Contents',
          };
          return translations[key] || fallback;
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
      const buttonTextSpan = fallbackButtonElement.querySelector('[data-testid="ti-button-text"]')!;

      expect(buttonTextSpan.textContent).toContain('View Issue Contents'); // Should use fallback
    });

    it('should display fallback text when translation key is missing for Journal', async () => {
      const fallbackMockTranslateService = {
        getTranslatedText: (key: string, fallback: string) => {
          // Only provide translation for article, not for journal
          const translations: { [key: string]: string } = {
            'LibKey.articleBrowZineWebLinkText': 'View Issue Contents',
          };
          return translations[key] || fallback;
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
      const buttonTextSpan = fallbackButtonElement.querySelector('[data-testid="ti-button-text"]')!;

      expect(buttonTextSpan.textContent).toContain('View Journal Contents'); // Should use fallback
    });
  });

  describe('Stack mode', () => {
    it('renders stacked-button with translated label and BrowZine icon when stack=true (default dropdown type)', async () => {
      componentRef.setInput('stack', true);
      componentRef.setInput('entityType', EntityType.Article);
      componentRef.setInput('link', {
        entityType: EntityType.Article,
        url: 'https://example.com/browzine',
        label: '',
        source: 'thirdIron',
      } as any);

      fixture.autoDetectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      const stacked = host.querySelector('stacked-button') as HTMLElement;
      expect(stacked).toBeTruthy();

      const textEl = stacked.querySelector('.quicklink-button-text');
      expect(textEl?.textContent || '').toContain('View Issue Contents');

      const svgIcon = stacked.querySelector('custom-svg-icon[data-testid="ti-svg-icon"]');
      expect(svgIcon).toBeTruthy();

      // default stackType is 'dropdown'
      const reflectType = stacked.getAttribute('ng-reflect-stack-type');
      if (reflectType !== null) {
        expect(reflectType).toBe('dropdown');
      }
    });

    it('passes stackType="main" to stacked-button when provided', async () => {
      componentRef.setInput('stack', true);
      componentRef.setInput('stackType', 'main');
      componentRef.setInput('entityType', EntityType.Journal);
      componentRef.setInput('link', {
        entityType: EntityType.Journal,
        url: 'https://example.com/journal',
        label: '',
        source: 'thirdIron',
      } as any);

      fixture.autoDetectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      const stacked = host.querySelector('stacked-button') as HTMLElement;
      expect(stacked).toBeTruthy();

      const textEl = stacked.querySelector('.quicklink-button-text');
      expect(textEl?.textContent || '').toContain('View Journal Contents');

      const reflectType = stacked.getAttribute('ng-reflect-stack-type');
      if (reflectType !== null) {
        expect(reflectType).toBe('main');
      }
    });

    it('does not render stacked-button when stack=false (base-button shown)', async () => {
      componentRef.setInput('stack', false);
      componentRef.setInput('entityType', EntityType.Article);
      componentRef.setInput('url', 'https://example.com/browzine');

      fixture.autoDetectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('stacked-button')).toBeFalsy();
      expect(host.querySelector('base-button')).toBeTruthy();
    });
  });
});
