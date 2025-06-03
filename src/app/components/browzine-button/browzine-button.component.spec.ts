import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowzineButtonComponent } from './browzine-button.component';
import { ComponentRef } from '@angular/core';
import { EntityType } from 'src/app/shared/entity-type.enum';

describe('BrowzineButtonComponent', () => {
  let component: BrowzineButtonComponent;
  let componentRef: ComponentRef<BrowzineButtonComponent>;
  let fixture: ComponentFixture<BrowzineButtonComponent>;
  let buttonElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowzineButtonComponent],
    });

    fixture = TestBed.createComponent(BrowzineButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show button label "View Issue Contents" for Article type', async () => {
    componentRef.setInput('url', 'www.test.browzine.com');
    componentRef.setInput('entityType', EntityType.Article);

    fixture.autoDetectChanges();
    buttonElement = fixture.nativeElement;
    await fixture.whenStable();

    const buttonTextSpan = buttonElement.querySelector(
      '[data-testid="ti-button-text"]'
    )!;
    expect(buttonTextSpan.textContent).toContain('View Issue Contents');
  });

  it('should show button label "View Journal Contents" for Journal type', async () => {
    componentRef.setInput('url', 'www.test.browzine.com');
    componentRef.setInput('entityType', EntityType.Journal);

    fixture.autoDetectChanges();
    buttonElement = fixture.nativeElement;
    await fixture.whenStable();

    const buttonTextSpan = buttonElement.querySelector(
      '[data-testid="ti-button-text"]'
    )!;
    expect(buttonTextSpan.textContent).toContain('View Journal Contents');
  });
});
