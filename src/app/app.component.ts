import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdviceComponent } from './advice/advice.component';

@Component({
  selector: 'app-root',
  imports: [AdviceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
