import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FirebaseTestingModule } from './firebase-testing.module';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseTestingModule, AppComponent, NoopAnimationsModule],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as site name '深川珈琲 在庫管理'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.siteName).toEqual('深川珈琲 在庫管理');
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    // Call detectChanges multiple times to allow Angular to settle after
    // onAuthStateChanged callback updates user state
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const toolbar = await loader.getHarness(MatToolbarHarness);
    expect((await toolbar.getRowsAsText())[0]).toMatch(/深川珈琲 在庫管理/);
  });
});
