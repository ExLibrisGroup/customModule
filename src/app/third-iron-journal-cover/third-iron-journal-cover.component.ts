import { Component, Input } from '@angular/core';
import { SearchEntity } from '../types/searchEntity.types';
import { isEmpty, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { JournalCoverService } from '../services/journal-cover.service';
import { SearchEntityService } from '../services/search-entity.service';

@Component({
  selector: 'custom-third-iron-journal-cover',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './third-iron-journal-cover.component.html',
  styleUrl: './third-iron-journal-cover.component.scss',
  providers: [JournalCoverService],
})
export class ThirdIronJournalCoverComponent {
  @Input() private hostComponent!: any;
  journalCoverUrl$!: Observable<string>;

  constructor(private journalCoverService: JournalCoverService) {}

  ngOnInit() {
    this.enhance(this.hostComponent.item);
  }

  enhance = (searchResult: SearchEntity) => {
    if (searchResult) {
      this.journalCoverUrl$ =
        this.journalCoverService.getJournalCoverUrl(searchResult);

      this.journalCoverUrl$.pipe(isEmpty()).subscribe((isEmpty) => {
        if (!isEmpty) {
          // hide default Primo image blocks if we find a Third Iron provided image
          const imageElements = document.getElementsByTagName(
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
