import { Component } from '@angular/core';
import { version } from './version';
import { Router } from '@angular/router';

@Component({
  selector: 'byor-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = version;

  constructor(private router: Router) {}

  goToAdminPage() {
    this.router.navigate(['admin']);
  }
}
