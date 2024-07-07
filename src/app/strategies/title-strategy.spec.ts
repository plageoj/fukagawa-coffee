import { Title } from '@angular/platform-browser';
import { PageTitleStrategy } from './title-strategy';
import { RouterStateSnapshot } from '@angular/router';

describe('TitleStrategy', () => {
  let title: Title;
  let strategy: PageTitleStrategy;

  beforeEach(() => {
    title = jasmine.createSpyObj<Title>('Title', ['setTitle']);
    strategy = new PageTitleStrategy(title);
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
