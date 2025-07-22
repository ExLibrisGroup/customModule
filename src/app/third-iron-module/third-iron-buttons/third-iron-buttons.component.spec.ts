import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ThirdIronButtonsComponent } from './third-iron-buttons.component';
import { SearchEntityService } from '../../services/search-entity.service';
import { MOCK_MODULE_PARAMETERS } from '../../services/config.service.spec';

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
        {
          provide: 'MODULE_PARAMETERS',
          useValue: MOCK_MODULE_PARAMETERS,
        },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    searchEntityService = TestBed.inject(SearchEntityService);
    fixture = TestBed.createComponent(ThirdIronButtonsComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges();
  });

  // TODO: Add tests for the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
