import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdviceStore } from './advice.store';
import { AdviceService } from './advice.service';
import { AdviceState, IAdviceSlip, IAdviceGiphy } from '../utils/advice.types';
import { InjectionToken } from '@angular/core';

describe('AdviceStore', () => {
  let adviceServiceMock: Partial<jest.Mocked<AdviceService>>;

  const initialState: AdviceState = {
    adviceList: [],
    isLoading: false,
  };

  const ADVICE_STATE = new InjectionToken<AdviceState>('AdviceState', {
    factory: () => initialState,
  });

  beforeEach(() => {
    adviceServiceMock = {
      getRandomAdvice: jest.fn(),
      searchAdvice: jest.fn(),
      translateAdviceToGiphy: jest.fn(),
      getTrendingGiphy: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AdviceStore,
        { provide: AdviceService, useValue: adviceServiceMock },
        { provide: ADVICE_STATE, useValue: initialState },
      ],
    });
  });

  it('initial state should be set correctly', () => {
    const store = TestBed.inject(AdviceStore);
    expect(store.adviceList()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  describe('getRandomAdvice', () => {
    it('should update store state with a random advice (with valid Giphy translation)', () => {
      const store = TestBed.inject(AdviceStore);

      const mockSlip: IAdviceSlip = { id: 1, advice: 'Test advice' };
      const mockRandomResponse = { slip: mockSlip };
      (adviceServiceMock.getRandomAdvice as jest.Mock).mockReturnValue(
        of(mockRandomResponse)
      );

      const mockGiphyData: IAdviceGiphy = {
        id: 'test-gif-id',
        images: {
          original: {
            url: 'https://test-gif-url',
            height: '100',
            width: '100',
            size: '1234',
            mp4: '',
            mp4_size: '',
            webp: '',
            webp_size: '',
            frames: '',
            hash: '',
          },
        },
        title: 'Test Gif',
      };
      (adviceServiceMock.translateAdviceToGiphy as jest.Mock).mockReturnValue(
        of({ data: mockGiphyData })
      );

      store.getRandomAdvice();

      expect(store.adviceList()).toHaveLength(1);
      expect(store.adviceList()[0]).toMatchObject({
        id: mockSlip.id,
        advice: mockSlip.advice,
        gifUrl: 'https://test-gif-url',
        gifTitle: 'Test Gif',
      });
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('searchAdvice', () => {
    it('should update store state with searched advice and fallback to trending when translation fails', () => {
      const store = TestBed.inject(AdviceStore);
      const query = 'test';
      const mockSlip: IAdviceSlip = { id: 2, advice: 'Search advice' };
      const mockSearchResponse = { slips: [mockSlip] };

      (adviceServiceMock.searchAdvice as jest.Mock).mockReturnValue(
        of(mockSearchResponse)
      );

      (adviceServiceMock.translateAdviceToGiphy as jest.Mock).mockReturnValue(
        of({ data: null })
      );

      const trendingGiphyData: IAdviceGiphy = {
        id: 'test-gif-id',
        images: {
          original: {
            url: 'https://trending-gif-url',
            height: '200',
            width: '200',
            size: '4321',
            mp4: '',
            mp4_size: '',
            webp: '',
            webp_size: '',
            frames: '',
            hash: '',
          },
        },
        title: 'Trending Gif',
      };
      (adviceServiceMock.getTrendingGiphy as jest.Mock).mockReturnValue(
        of({ data: [trendingGiphyData] })
      );

      store.searchAdvice(query);

      expect(store.adviceList()).toHaveLength(1);
      expect(store.adviceList()[0]).toMatchObject({
        id: mockSlip.id,
        advice: mockSlip.advice,
        gifUrl: 'https://trending-gif-url',
        gifTitle: 'Trending Gif',
      });
      expect(store.isLoading()).toBe(false);
    });

    it('should update store state with an empty list if no slips are returned', () => {
      const store = TestBed.inject(AdviceStore);
      const query = 'nonexistent';
      const mockSearchResponse = { total_results: 0, query, slips: [] };

      (adviceServiceMock.searchAdvice as jest.Mock).mockReturnValue(
        of(mockSearchResponse)
      );

      store.searchAdvice(query);

      expect(store.adviceList()).toEqual([]);
      expect(store.isLoading()).toBe(false);
    });
  });
});
