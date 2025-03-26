import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AdviceComponent } from './advice.component';
import { AdviceStore } from './services/advice.store';
import { MockComponent, MockModule } from 'ng-mocks';
import { AdviceCardComponent } from './advice-card/advice-card.component';
import { Signal, signal, WritableSignal } from '@angular/core';

describe('AdviceComponent', () => {
  let component: AdviceComponent;
  let fixture: ComponentFixture<AdviceComponent>;
  let adviceStoreMock: {
    adviceList: WritableSignal<never[]>;
    isLoading: WritableSignal<boolean>;
    getRandomAdvice: jest.Mock<any, any, any>;
    searchAdvice: jest.Mock<any, any, any>;
  };

  beforeEach(() => {
    adviceStoreMock = {
      adviceList: signal([]),
      isLoading: signal(false),
      getRandomAdvice: jest.fn<void, [Signal<string>]>(),
      searchAdvice: jest.fn<void, [Signal<string>]>(),
    };

    TestBed.configureTestingModule({
      imports: [
        AdviceComponent,
        MockComponent(AdviceCardComponent),
        MockModule(ReactiveFormsModule),
      ],
    })
      .overrideProvider(AdviceStore, {
        useValue: adviceStoreMock,
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form control value', () => {
    expect(component.searchAdviceForm.get('searchAdvice')?.value).toBe('');
  });

  it('ngOnInit should call getAdvice', () => {
    const getAdviceSpy = jest.spyOn(component, 'getAdvice');
    component.ngOnInit();
    expect(getAdviceSpy).toHaveBeenCalled();
  });

  it('getAdvice should set empty value in the search form', () => {
    component.getAdvice();
    expect(component.searchAdviceForm.get('searchAdvice')?.value).toBe('');
  });

  it('searchAdvice should call searchAdvice on AdviceStore', () => {
    const searchQuery = 'test advice';
    const searchAdviceSpy = jest.spyOn(adviceStoreMock, 'searchAdvice');

    component.searchAdviceForm.get('searchAdvice')?.setValue(searchQuery);
    component.searchAdvice();

    expect(searchAdviceSpy).toHaveBeenCalledWith(searchQuery);
  });
});
