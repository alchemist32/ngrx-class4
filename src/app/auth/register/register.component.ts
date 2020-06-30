import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { isLoading, stopLoading } from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registerForm: FormGroup
  private uiSubscription: Subscription;
  public loading: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => this.loading = ui.isLoading);

  }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  public createUser(): void {
    if (this.registerForm.valid) {
      this.store.dispatch(isLoading());
      // Swal.fire({
      //   title: 'loading...',
      //   timerProgressBar: true,
      //   onBeforeOpen: () => {
      //     Swal.showLoading()
      //   }
      // });

      const {name, email, password } = this.registerForm.value;
      this.authService.createUser(name, email, password)
        .then(credentials => {
          // Swal.close();
          console.log(credentials);
          this.store.dispatch(stopLoading());
          this.router.navigate(['/']);
        })
        .catch(error => {
          this.store.dispatch(stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
        });
    }
  }

}
