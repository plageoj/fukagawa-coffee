import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title === undefined) {
      this.title.setTitle(environment.siteName);
    } else {
      this.title.setTitle(`${title} - ${environment.siteName}`);
    }
  }
}
