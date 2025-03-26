import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IAdviceSlip } from '../utils/advice.types';
import { AdviceStore } from '../services/advice.store';
import { AdviceIndexPipe } from '../pipes/advice-index.pipe';

@Component({
  selector: 'advice-card',
  imports: [ReactiveFormsModule, AdviceIndexPipe],
  templateUrl: './advice-card.component.html',
  styleUrl: './advice-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdviceCardComponent {
  public adviceSlip = input.required<IAdviceSlip>();

  public readonly adviceStore = inject(AdviceStore);
  public adviceList = this.adviceStore.adviceList;
  public isLoading = this.adviceStore.isLoading;

  public selectedAdviceIndex = computed(() => {
    return this.adviceList().findIndex(
      (advice) => advice.id === this.adviceSlip().id
    );
  });
}
