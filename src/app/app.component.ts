import { Component } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user: User | null = null;
  siteName = environment.siteName;

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }
}
