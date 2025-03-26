import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AdviceCardComponent } from './advice-card.component';
import { AdviceStore } from '../services/advice.store';
import { MockModule, MockProvider } from 'ng-mocks';
import { signal, WritableSignal } from '@angular/core';
import { IAdviceSlip } from '../utils/advice.types';

describe('AdviceCardComponent', () => {
  let component: AdviceCardComponent;
  let fixture: ComponentFixture<AdviceCardComponent>;
  let adviceStoreMock: {
    adviceList: WritableSignal<IAdviceSlip[]>;
    isLoading: WritableSignal<boolean>;
  };

  beforeEach(() => {
    adviceStoreMock = {
      adviceList: signal<IAdviceSlip[]>([
        {
          id: 1,
          advice: 'Advice 1',
          gifUrl: 'https://example.com/gif1',
          gifTitle: 'Gif 1',
        },
        {
          id: 2,
          advice: 'Advice 2',
          gifUrl: 'https://example.com/gif2',
          gifTitle: 'Gif 2',
        },
      ]),
      isLoading: signal<boolean>(false),
    };

    TestBed.configureTestingModule({
      imports: [AdviceCardComponent, MockModule(ReactiveFormsModule)],
      providers: [MockProvider(AdviceStore, adviceStoreMock)],
    }).compileComponents();

    fixture = TestBed.createComponent(AdviceCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('adviceSlip', {
      id: 1,
      advice: 'Advice 1',
      gifUrl: 'https://example.com/gif1',
      gifTitle: 'Gif 1',
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct adviceList from store', () => {
    expect(component.adviceList()).toEqual([
      {
        id: 1,
        advice: 'Advice 1',
        gifUrl: 'https://example.com/gif1',
        gifTitle: 'Gif 1',
      },
      {
        id: 2,
        advice: 'Advice 2',
        gifUrl: 'https://example.com/gif2',
        gifTitle: 'Gif 2',
      },
    ]);
  });

  it('should select the correct advice index based on the current adviceSlip', () => {
    const mockAdviceSlip: IAdviceSlip = {
      id: 1,
      advice: 'Advice 1',
      gifUrl: 'https://example.com/gif1',
      gifTitle: 'Gif 1',
    };
    fixture.componentRef.setInput('adviceSlip', mockAdviceSlip);
    fixture.detectChanges();

    expect(component.selectedAdviceIndex()).toBe(0);
  });

  it('should return -1 if the adviceSlip does not exist in the adviceList', () => {
    const mockAdviceSlip: IAdviceSlip = {
      id: 999,
      advice: 'Non-existing advice',
      gifUrl: '',
      gifTitle: '',
    };
    fixture.componentRef.setInput('adviceSlip', mockAdviceSlip);
    fixture.detectChanges();

    expect(component.selectedAdviceIndex()).toBe(-1);
  });
});
