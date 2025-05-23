import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowzineButtonComponent } from './browzine-button.component';
import { ComponentRef } from '@angular/core';
import { ButtonInfo } from 'src/app/types/buttonInfo.types';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { EntityType } from 'src/app/shared/entity-type.enum';

describe('BrowzineButtonComponent', () => {
  let component: BrowzineButtonComponent;
  let componentRef: ComponentRef<BrowzineButtonComponent>;
  let fixture: ComponentFixture<BrowzineButtonComponent>;
  let buttonElement: HTMLElement;

  const defaultButtonInfo: ButtonInfo = {
    ariaLabel: 'Arial Label Text!',
    buttonText: 'Test Button Text!',
    color: 'sys-primary',
    icon: 'open-book-icon',
    url: 'www.test.com',
    browzineUrl: 'www.browzine.com',
    showBrowzineButton: true,
    buttonType: ButtonType.ArticleLink,
    entityType: EntityType.Article,
  };

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

  it('should show button label "View Issue Contents" for Article type', () => {
    componentRef.setInput('buttonInfo', defaultButtonInfo);

    fixture.detectChanges();
    buttonElement = fixture.nativeElement;

    // TODO check for button title
  });

  it('should show button label "View Journal Contents" for Journal type', () => {
    const journalButtonInfo = {
      ...defaultButtonInfo,
      entityType: EntityType.Journal,
    };
    componentRef.setInput('buttonInfo', journalButtonInfo);

    fixture.detectChanges();
    buttonElement = fixture.nativeElement;

    // TODO check for button title
  });
});
