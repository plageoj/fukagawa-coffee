import { Component, Inject } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatListItem, MatNavList } from "@angular/material/list";
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from "@angular/material/sidenav";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { Auth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { environment } from "src/environments/environment";

import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { AUTH } from "./services/firebase.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
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
    RouterOutlet,
  ],
})
export class AppComponent {
  user: User | null = null;
  siteName = environment.siteName;

  constructor(
    @Inject(AUTH) private readonly auth: Auth,
    private readonly router: Router,
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl("/login");
  }
}
