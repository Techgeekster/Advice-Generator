import { TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { AppComponent } from './app.component';
import { AdviceComponent } from './advice/advice.component';

fdescribe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockComponent(AdviceComponent)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
