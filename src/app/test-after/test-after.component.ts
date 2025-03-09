import { Component, Inject, Input, Optional } from '@angular/core';
declare const __webpack_public_path__: string;

@Component({
  selector: 'custom-test-after',
  templateUrl: './test-after.component.html',
  styleUrls: ['./test-after.component.scss']
})
export class TestAfterComponent {
  subject: string | undefined;
  imageUrl = __webpack_public_path__ + 'assets/images/CustomModule_Waving_Winking.jpeg';
  @Input() private hostComponent!: any;

  constructor( ) { }
  ngOnInit(): void {
    this.subject = this.getSubjectText();
    console.log('TestAfterComponent ngOnInit:', this.subject);
  }

  private getSubjectText(): string | undefined {
    console.log('TestAfterComponent getSubjectText:', this.hostComponent);
    return this.hostComponent.searchResult?.pnx?.display?.['subject']?.join(', ');
  }
}
