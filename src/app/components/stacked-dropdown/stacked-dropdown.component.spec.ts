import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedDropdownComponent } from './stacked-dropdown.component';
import { ComponentRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { MatSelect } from '@angular/material/select';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StackedDropdownComponent', () => {
  let component: StackedDropdownComponent;
  let componentRef: ComponentRef<StackedDropdownComponent>;
  let fixture: ComponentFixture<StackedDropdownComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    const translateServiceMock = {
      instant: (key: string) => key,
    } as Partial<TranslateService> as TranslateService;

    TestBed.configureTestingModule({
      imports: [StackedDropdownComponent, NoopAnimationsModule],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }],
    });
    fixture = TestBed.createComponent(StackedDropdownComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('renders main-button when first link is from ThirdIron', () => {
    const links = [
      {
        source: 'thirdIron',
        entityType: 'HTML',
        url: 'https://example.com/article',
        mainButtonType: 'ArticleLink',
        ariaLabel: 'Article',
        label: 'Read Article',
      },
    ];
    componentRef.setInput('combinedLinks', links as any);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const mainButton = nativeEl.querySelector('main-button');
    const stackedButton = nativeEl.querySelector('stacked-button');
    expect(mainButton).toBeTruthy();
    // When stack=true, main-button renders a stacked-button internally
    expect(stackedButton).toBeTruthy();
  });

  it('renders stacked-button when first link is not from ThirdIron', () => {
    const links = [
      {
        source: 'quicklink',
        entityType: 'PDF',
        url: 'https://example.com/pdf',
        ariaLabel: 'Get PDF',
        label: 'Get PDF',
      },
    ];
    componentRef.setInput('combinedLinks', links as any);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const mainButton = nativeEl.querySelector('main-button');
    const stackedButton = nativeEl.querySelector('stacked-button');
    expect(mainButton).toBeFalsy();
    expect(stackedButton).toBeTruthy();
  });

  it('renders article-link-button for ThirdIron secondary link in dropdown', () => {
    const links = [
      {
        source: 'quicklink',
        entityType: 'PDF',
        url: 'https://example.com/pdf',
        ariaLabel: 'Get PDF',
        label: 'Get PDF',
      },
      {
        source: 'thirdIron',
        entityType: 'HTML',
        url: 'https://example.com/article',
        showSecondaryButton: true,
        ariaLabel: 'Article',
        label: 'Read Article',
      },
    ];
    componentRef.setInput('combinedLinks', links as any);
    fixture.detectChanges();

    const selectDe = fixture.debugElement.query(By.css('mat-select'));
    const select = selectDe.componentInstance as MatSelect;
    select.open();
    fixture.detectChanges();

    const overlayContainer = TestBed.inject(OverlayContainer);
    const overlayEl = overlayContainer.getContainerElement();
    const articleLinkButtons = overlayEl.querySelectorAll('article-link-button');
    expect(articleLinkButtons.length).toBe(1);
  });

  it('renders stacked-button in dropdown for non-ThirdIron links', () => {
    const links = [
      {
        source: 'thirdIron',
        entityType: 'HTML',
        url: 'https://example.com/article',
        mainButtonType: 'ArticleLink',
        ariaLabel: 'Article',
        label: 'Read Article',
      },
      {
        source: 'quicklink',
        entityType: 'HTML',
        url: 'https://example.com/hosted-html',
        ariaLabel: 'Read Online',
        label: 'Read Online',
      },
    ];
    componentRef.setInput('combinedLinks', links as any);
    fixture.detectChanges();

    const selectDe = fixture.debugElement.query(By.css('mat-select'));
    const select = selectDe.componentInstance as MatSelect;
    select.open();
    fixture.detectChanges();

    const overlayContainer = TestBed.inject(OverlayContainer);
    const overlayEl = overlayContainer.getContainerElement();
    const stackedButtons = overlayEl.querySelectorAll('stacked-button');
    expect(stackedButtons.length).toBe(1);
  });

  it('always renders a mat-select dropdown container', () => {
    const links = [
      {
        source: 'quicklink',
        entityType: 'PDF',
        url: 'https://example.com/pdf',
        ariaLabel: 'Get PDF',
        label: 'Get PDF',
      },
    ];
    componentRef.setInput('combinedLinks', links as any);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const dropdown = nativeEl.querySelector('.ti-dropdown');
    const toggle = nativeEl.querySelector('.ti-dropdown-toggle');
    expect(dropdown).toBeTruthy();
    expect(toggle).toBeTruthy();
  });
});
