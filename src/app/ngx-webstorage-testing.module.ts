import { NgModule } from '@angular/core';
import {
  provideNgxWebstorage,
  withLocalStorage,
  withNgxWebstorageConfig,
  withSessionStorage,
} from 'ngx-webstorage';

@NgModule({
  providers: [
    provideNgxWebstorage(
      withNgxWebstorageConfig({
        prefix: 'fukagawa-coffee-test',
        separator: '.',
        caseSensitive: true,
      }),
      withLocalStorage(),
      withSessionStorage(),
    ),
  ],
})
export class NgxWebstorageTestingModule {}
