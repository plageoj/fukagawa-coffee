import { Component } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user: User | null = null;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  logout() {
    this.auth.signOut();
  }
}
