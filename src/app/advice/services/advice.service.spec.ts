import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AdviceService } from './advice.service';
import {
  IAdviceSlipResponse,
  IAdviceSearch,
  IAdviceGiphyResponse,
  IAdviceSlip,
} from '../utils/advice.types';
import { provideHttpClient } from '@angular/common/http';

describe('AdviceService', () => {
  let service: AdviceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdviceService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AdviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRandomAdvice', () => {
    it('should return a random advice', () => {
      const mockAdviceResponse: IAdviceSlipResponse = {
        slip: {
          id: 1,
          advice: 'Test advice',
        },
      };

      service.getRandomAdvice().subscribe((response) => {
        expect(response).toEqual(mockAdviceResponse);
      });

      const req = httpMock.expectOne('https://api.adviceslip.com/advice');
      expect(req.request.method).toBe('GET');
      req.flush(mockAdviceResponse);
    });
  });

  describe('getAdviceById', () => {
    it('should return advice by ID', () => {
      const mockAdvice: IAdviceSlip = {
        id: 1,
        advice: 'Test advice by ID',
      };

      service.getAdviceById(1).subscribe((response) => {
        expect(response).toEqual(mockAdvice);
      });

      const req = httpMock.expectOne('https://api.adviceslip.com/advice/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockAdvice);
    });
  });

  describe('searchAdvice', () => {
    it('should return searched advice', () => {
      const mockSearchResponse: IAdviceSearch = {
        total_results: 1,
        query: 'test',
        slips: [
          {
            id: 1,
            advice: 'Test advice for search',
          },
        ],
      };

      service.searchAdvice('test').subscribe((response) => {
        expect(response).toEqual(mockSearchResponse);
      });

      const req = httpMock.expectOne(
        'https://api.adviceslip.com/advice/search/test'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSearchResponse);
    });
  });

  describe('translateAdviceToGiphy', () => {
    it('should translate advice to Giphy', () => {
      const mockAdviceSlip: IAdviceSlip = { id: 1, advice: 'Test advice' };
      const mockGiphyResponse: IAdviceGiphyResponse = {
        data: {
          id: '1',
          title: 'Test Giphy',
          images: {
            original: {
              url: 'https://giphy.com/test-url',
              height: '100',
              width: '100',
              size: '1000',
              mp4_size: '500',
              mp4: 'https://giphy.com/test-mp4',
              webp_size: '200',
              webp: 'https://giphy.com/test-webp',
              frames: '30',
              hash: 'testhash',
            },
          },
        },
      };

      service.translateAdviceToGiphy(mockAdviceSlip).subscribe((response) => {
        expect(response).toEqual(mockGiphyResponse);
      });

      const params = {
        api_key: 'zmZ1HA9AImEkc5VQLeP5AG5RakHZvi5i',
        s: mockAdviceSlip.advice,
      };

      const req = httpMock.expectOne(
        `https://api.giphy.com/v1/gifs/translate?api_key=zmZ1HA9AImEkc5VQLeP5AG5RakHZvi5i&s=Test%20advice`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('api_key')).toBe(params.api_key);
      expect(req.request.params.get('s')).toBe(params.s);
      req.flush(mockGiphyResponse);
    });
  });

  describe('getTrendingGiphy', () => {
    it('should return trending giphy', () => {
      const mockTrendingGiphyResponse: IAdviceGiphyResponse = {
        data: [
          {
            id: '1',
            title: 'Trending Giphy',
            images: {
              original: {
                url: 'https://giphy.com/trending-url',
                height: '200',
                width: '200',
                size: '1500',
                mp4_size: '700',
                mp4: 'https://giphy.com/trending-mp4',
                webp_size: '300',
                webp: 'https://giphy.com/trending-webp',
                frames: '40',
                hash: 'trendinghash',
              },
            },
          },
        ],
      };

      service.getTrendingGiphy().subscribe((response) => {
        expect(response).toEqual(mockTrendingGiphyResponse);
      });

      const params = {
        api_key: 'zmZ1HA9AImEkc5VQLeP5AG5RakHZvi5i',
        limit: '1',
      };

      const req = httpMock.expectOne(
        `https://api.giphy.com/v1/gifs/trending?api_key=zmZ1HA9AImEkc5VQLeP5AG5RakHZvi5i&limit=1`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('api_key')).toBe(params.api_key);
      expect(req.request.params.get('limit')).toBe(params.limit);
      req.flush(mockTrendingGiphyResponse);
    });
  });
});
