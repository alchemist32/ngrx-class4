import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import {
  isLoading, stopLoading
} from 'src/app/shared/ui.actions';

import Swal  from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  private closeModal: boolean = false;
  public loading: boolean;
  private uiSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui')
      .subscribe( ui => {
        this.loading = ui.isLoading;
        console.log('loading');
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  public loginUser(): void {
   
    if (this.loginForm.valid){
      this.store.dispatch(isLoading());

      // Swal.fire({
      //   title: 'loading...',
      //   timerProgressBar: true,
      //   onBeforeOpen: () => {
      //     Swal.showLoading()
      //   }
      // });

      const { email, password } = this.loginForm.value;
      this.authService.authenticateUser(email, password)
        .then(success => {
          // Swal.close();
          this.store.dispatch(stopLoading())
          this.router.navigate(['/']);
        })
        .catch(error => {
          this.store.dispatch(stopLoading());
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
        })
    }
  }
}
