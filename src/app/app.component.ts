import { Component } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatIconButton } from '@angular/material/button';

import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    RouterLink,
    MatSidenavContent,
    RouterOutlet
]
})
export class AppComponent {
  user: User | null = null;
  siteName = environment.siteName;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }
}
