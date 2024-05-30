import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [],
  templateUrl: './error-404.component.html',
})
export class Error404Component {

  private router = inject(Router);
  redirectToInit() {
    this.router.navigate(['/']);
  }

}
