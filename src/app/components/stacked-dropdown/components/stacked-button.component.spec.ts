import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { StackedButtonComponent } from './stacked-button.component';
import { CombinedLink } from 'src/app/types/primoViewModel.types';

describe('StackedButtonComponent', () => {
  let component: StackedButtonComponent;
  let componentRef: ComponentRef<StackedButtonComponent>;
  let fixture: ComponentFixture<StackedButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StackedButtonComponent],
    });
    fixture = TestBed.createComponent(StackedButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('openLink should open in same tab for directLink source', () => {
    const link: CombinedLink = {
      entityType: 'directLink',
      url: 'https://example.com',
      source: 'directLink',
    };

    componentRef.setInput('link', link);
    componentRef.setInput('stackType', 'main');
    fixture.detectChanges();

    const openSpy = spyOn(window, 'open');
    component.openLink();
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_self');
  });

  it('openLink should open in new tab for non-directLink source', () => {
    const link: CombinedLink = {
      entityType: 'PDF',
      url: 'https://example.com/pdf',
      source: 'quicklink',
    };

    componentRef.setInput('link', link);
    componentRef.setInput('stackType', 'main');
    fixture.detectChanges();

    const openSpy = spyOn(window, 'open');
    component.openLink();
    expect(openSpy).toHaveBeenCalledWith('https://example.com/pdf', '_blank');
  });

  it('openLink should not open when url is missing/empty', () => {
    const link: CombinedLink = {
      entityType: 'HTML',
      url: '',
      source: 'quicklink',
    };

    componentRef.setInput('link', link);
    componentRef.setInput('stackType', 'main');
    fixture.detectChanges();

    const openSpy = spyOn(window, 'open');
    component.openLink();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
