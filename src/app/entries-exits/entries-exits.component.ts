import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EntriesExitsService } from '../services/entries-exits.service';
import { EntriesExits } from '../models/entries-exits.model';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../shared/ui.actions';

@Component({
  selector: 'app-entries-exits',
  templateUrl: './entries-exits.component.html',
  styleUrls: ['./entries-exits.component.css']
})
export class EntriesExitsComponent implements OnInit, OnDestroy {

  public entriesExitsForm: FormGroup;
  public type: string = 'entry'
  public loading: boolean = false;

  private uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private entriesExitsService: EntriesExitsService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.entriesExitsForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, Validators.required],
    })

    this.uiSubscription = this.store.select('ui')
      .subscribe((ui) => {
        this.loading = ui.isLoading;
      });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  public saveForm(): void {
    this.store.dispatch(actions.isLoading());
    if (this.entriesExitsForm.valid){

      console.log(this.entriesExitsForm.value);
      console.log(this.type);

      const { description, amount } = this.entriesExitsForm.value;
      const entryExit = new EntriesExits(description, amount, this.type);

      this.entriesExitsService.createEntriesExits(entryExit)
        .then((res) => {
          this.store.dispatch(actions.stopLoading());
          this.entriesExitsForm.reset();
          Swal.fire('Record created', description, 'success')
        })
        .catch((err) => {
          this.store.dispatch(actions.stopLoading());
          Swal.fire('Error', err.message, 'error');
        });
    }
  }

}
