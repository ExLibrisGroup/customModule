import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ThirdIronButtonsComponent } from './third-iron-buttons.component';
import { SearchEntityService } from '../../services/search-entity.service';

describe('ThirdIronButtonsComponent', () => {
  let httpTesting: HttpTestingController;
  let searchEntityService: SearchEntityService;
  let component: ThirdIronButtonsComponent;
  let fixture: ComponentFixture<ThirdIronButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ThirdIronButtonsComponent],
      providers: [
        SearchEntityService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    searchEntityService = TestBed.inject(SearchEntityService);
    fixture = TestBed.createComponent(ThirdIronButtonsComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges();
  });

  // TODO: Add tests for the component
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
