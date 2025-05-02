import { Component, ElementRef, Input } from '@angular/core';
import { SearchEntity } from '../types/searchEntity.types';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { JournalCoverService } from '../services/journal-cover.service';

@Component({
  selector: 'custom-third-iron-journal-cover',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './third-iron-journal-cover.component.html',
  styleUrl: './third-iron-journal-cover.component.scss',
  providers: [JournalCoverService],
})
export class ThirdIronJournalCoverComponent {
  elementRef: ElementRef;
  constructor(
    private journalCoverService: JournalCoverService,
    elementRef: ElementRef
  ) {
    this.elementRef = elementRef;
  }

  @Input() private hostComponent!: any;
  journalCoverUrl$!: Observable<string>;

  ngOnInit() {
    this.enhance(this.hostComponent.item);
  }

  enhance = (searchResult: SearchEntity) => {
    if (searchResult) {
      this.journalCoverUrl$ =
        this.journalCoverService.getJournalCoverUrl(searchResult);

      this.journalCoverUrl$.subscribe((journalCoverUrl) => {
        // hide default Primo image blocks if we find a Third Iron provided image
        if (journalCoverUrl !== '') {
          const hostElem = this.elementRef.nativeElement; // this component's template element
          const imageBlockParent = hostElem.parentNode.parentNode; // jump up to parent of <nde-record-image />
          const imageElements = imageBlockParent.getElementsByTagName(
            'nde-record-image'
          ) as HTMLCollectionOf<HTMLElement>;

          Array.from(imageElements).forEach((elem) => {
            elem.style.display = 'none';
          });
        }
      });
    }
  };
}
