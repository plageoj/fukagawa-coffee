import { Title } from '@angular/platform-browser';
import { PageTitleStrategy } from './title-strategy';

describe('TitleStrategy', () => {
  it('should create an instance', () => {
    expect(new PageTitleStrategy(new Title(''))).toBeTruthy();
  });
});
