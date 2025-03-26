import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AdviceState, IAdviceGiphy, IAdviceSlip } from '../utils/advice.types';
import { inject, InjectionToken } from '@angular/core';
import { AdviceService } from './advice.service';
import {
  finalize,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

const initialState: AdviceState = {
  adviceList: [],
  isLoading: false,
};

const ADVICE_STATE = new InjectionToken<AdviceState>('AdviceState', {
  factory: () => initialState,
});

export const AdviceStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(ADVICE_STATE)),
  withMethods((store, adviceService = inject(AdviceService)) => ({
    getRandomAdvice: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          adviceService.getRandomAdvice().pipe(
            switchMap((response) =>
              translateAdviceSlipsToGiphy([response.slip], adviceService)
            ),
            tap((slipsWithGiphy) => {
              patchState(store, {
                adviceList: slipsWithGiphy,
              });
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    searchAdvice: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) =>
          adviceService.searchAdvice(query).pipe(
            switchMap((response) => {
              const slips = response?.slips;
              if (!slips || slips.length === 0) {
                return of([]);
              }

              return translateAdviceSlipsToGiphy(slips, adviceService);
            }),
            tap((updatedSlips) =>
              patchState(store, {
                adviceList: updatedSlips,
              })
            ),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
  }))
);

const translateAdviceSlipsToGiphy = (
  adviceSlips: IAdviceSlip[],
  adviceService: AdviceService
): Observable<IAdviceSlip[]> => {
  return forkJoin(
    adviceSlips.map((adviceSlip) =>
      adviceService.translateAdviceToGiphy(adviceSlip).pipe(
        switchMap((giphy) => {
          let gif = giphy?.data as IAdviceGiphy;
          let gifUrl = gif?.images?.original?.url;
          let gifTitle = gif?.title;

          if (gif) {
            return of({
              ...adviceSlip,
              gifUrl,
              gifTitle,
            });
          }

          return adviceService.getTrendingGiphy().pipe(
            map((trendingGiphy) => {
              gif = (trendingGiphy?.data as IAdviceGiphy[])?.[0];
              gifUrl = gif?.images?.original?.url;
              gifTitle = gif?.title;

              return {
                ...adviceSlip,
                gifUrl,
                gifTitle,
              };
            })
          );
        })
      )
    )
  );
};
