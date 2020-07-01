import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { EntriesExits } from '../models/entries-exits.model';
import { AuthService } from './auth.service'
@Injectable({
  providedIn: 'root'
})
export class EntriesExitsService {

  constructor(private fireStore: AngularFirestore, private authService: AuthService) { }

  public createEntriesExits(entryExit: EntriesExits): Promise<any> {
    console.log('param', entryExit)
    const uid = this.authService.userInfo.uid;
    console.log(uid)
    return this.fireStore.doc(`${ uid }/entries-exits`)
      .collection('items')
      .add({...entryExit});
  }
}
