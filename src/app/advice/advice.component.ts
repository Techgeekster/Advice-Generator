import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AdviceStore } from './services/advice.store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdviceCardComponent } from './advice-card/advice-card.component';

@Component({
  selector: 'advice',
  imports: [ReactiveFormsModule, AdviceCardComponent],
  providers: [AdviceStore],
  templateUrl: './advice.component.html',
  styleUrl: './advice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdviceComponent implements OnInit {
  public readonly adviceStore = inject(AdviceStore);
  public adviceList = this.adviceStore.adviceList;
  public isLoading = this.adviceStore.isLoading;

  public searchAdviceForm = new FormGroup<{
    searchAdvice: FormControl<string | null>;
  }>({
    searchAdvice: new FormControl(''),
  });

  public ngOnInit(): void {
    this.getAdvice();
  }

  public getAdvice(): void {
    this.searchAdviceForm.get('searchAdvice')?.setValue('');
    this.adviceStore.getRandomAdvice();
  }

  public searchAdvice(): void {
    const query = this.searchAdviceForm.get('searchAdvice')?.value;
    if (!query) {
      return;
    }

    this.adviceStore.searchAdvice(query);
  }
}
