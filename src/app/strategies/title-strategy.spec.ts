import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { PageTitleStrategy } from './title-strategy';
import { RouterStateSnapshot } from '@angular/router';

describe('TitleStrategy', () => {
  let title: jasmine.SpyObj<Title>;
  let strategy: PageTitleStrategy;

  beforeEach(() => {
    const titleSpy = jasmine.createSpyObj<Title>('Title', ['setTitle']);

    TestBed.configureTestingModule({
      providers: [
        PageTitleStrategy,
        { provide: Title, useValue: titleSpy },
      ],
    });

    strategy = TestBed.inject(PageTitleStrategy);
    title = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('should create an instance', () => {
    expect(strategy).toBeTruthy();
  });

  it('should set title', () => {
    const routerState = jasmine.createSpyObj<RouterStateSnapshot>(
      'routerStateSnapshot',
      ['toString'],
    );
    spyOn(strategy, 'buildTitle').and.returnValue('test');
    strategy.updateTitle(routerState);
    expect(title.setTitle).toHaveBeenCalledOnceWith('test - 深川珈琲 在庫管理');
  });

  it('should set site name when empty', () => {
    const routerState = jasmine.createSpyObj<RouterStateSnapshot>(
      'routerStateSnapshot',
      ['toString'],
    );
    strategy.updateTitle(routerState);
    expect(title.setTitle).toHaveBeenCalledOnceWith('深川珈琲 在庫管理');
  });
});
