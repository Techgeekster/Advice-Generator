import { Injectable } from '@angular/core';
import {
  IAdviceGiphyResponse,
  IAdviceSearch,
  IAdviceSlip,
  IAdviceSlipResponse,
} from '../utils/advice.types';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdviceService {
  ADVICE_API_URL = 'https://api.adviceslip.com/advice';
  GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';
  GIPHY_API_KEY = 'zmZ1HA9AImEkc5VQLeP5AG5RakHZvi5i';

  constructor(private http: HttpClient) {}

  public getRandomAdvice(): Observable<IAdviceSlipResponse> {
    return this.http.get<IAdviceSlipResponse>(this.ADVICE_API_URL);
  }

  public getAdviceById(id: number): Observable<IAdviceSlip> {
    return this.http.get<IAdviceSlip>(`${this.ADVICE_API_URL}/${id}`);
  }

  public searchAdvice(query: string): Observable<IAdviceSearch> {
    return this.http.get<IAdviceSearch>(
      `${this.ADVICE_API_URL}/search/${query}`
    );
  }

  public translateAdviceToGiphy(
    adviceSlip: IAdviceSlip
  ): Observable<IAdviceGiphyResponse> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        api_key: this.GIPHY_API_KEY,
        s: adviceSlip.advice,
      },
    });

    return this.http.get<IAdviceGiphyResponse>(
      `${this.GIPHY_API_URL}/translate`,
      { params }
    );
  }

  public getTrendingGiphy(): Observable<IAdviceGiphyResponse> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        api_key: this.GIPHY_API_KEY,
        limit: 1,
      },
    });

    return this.http.get<IAdviceGiphyResponse>(
      `${this.GIPHY_API_URL}/trending`,
      { params }
    );
  }
}
