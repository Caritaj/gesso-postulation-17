import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-500',
  standalone: true,
  imports: [],
  templateUrl: './error-500.component.html',
})
export class Error500Component {

  private router = inject(Router);

  redirectToInit() {
    this.router.navigate(['/']);
  }
}
