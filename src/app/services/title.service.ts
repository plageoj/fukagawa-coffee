import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TitleService extends Title {
  setTitle(...newTitle: string[]): void {
    if (newTitle.length) {
      super.setTitle(`${newTitle.join(' - ')} - ${environment.siteName}`);
    } else {
      super.setTitle(environment.siteName);
    }
  }
}
