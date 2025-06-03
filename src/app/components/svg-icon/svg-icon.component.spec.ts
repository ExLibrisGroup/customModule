import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconComponent } from './svg-icon.component';
import { ComponentRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SvgIconComponent', () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let componentRef: ComponentRef<SvgIconComponent>;
  let iconElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SvgIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Browzine open-book-icon', () => {
    componentRef.setInput('name', 'open-book-icon');

    fixture.detectChanges();
    iconElement = fixture.nativeElement;

    const icon = iconElement.querySelector('open-book-icon');
    console.log('iconElement', iconElement);
    console.log('icon', icon);
    //TODO - check for expected icon
  });
  it('should display pdf-download-icon', () => {
    componentRef.setInput('name', 'pdf-download-icon');

    fixture.detectChanges();
    iconElement = fixture.nativeElement;

    //TODO - check for expected icon
  });
  it('should display article-link-icon', () => {
    componentRef.setInput('name', 'article-link-icon');

    fixture.detectChanges();
    iconElement = fixture.nativeElement;

    //TODO - check for expected icon
  });
  it('should display article-alert-icon', () => {
    componentRef.setInput('name', 'article-alert-icon');

    fixture.detectChanges();
    iconElement = fixture.nativeElement;

    //TODO - check for expected icon
  });
  it('should display icon in alert red', () => {
    //TODO - set and check for alert color
  });
});
