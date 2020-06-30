import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unsetUser } from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription;

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>,
  ) { }

  public initAuthListener(): void {
    this.auth.authState.subscribe(user => { 
      if (user) {
        this.userSubscription = this.firestore.doc(`${user.uid}/user`).valueChanges()
          .subscribe((firestoreUser: any) => {
            const castUser = User.fromFirebase(firestoreUser)
            this.store.dispatch( setUser({user: castUser}) );
          });
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(unsetUser());
      }
    })
  }

  public createUser(name: string, email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      const newUser = new User(user.uid, name, user.email)
      return this.firestore.doc(`${user.uid}/user`)
        .set({...newUser});
    });
  }

  public authenticateUser(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): Promise<void> {
    return this.auth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.auth.authState
      .pipe(
        map((user) => user !== null)
      );
  }

}
