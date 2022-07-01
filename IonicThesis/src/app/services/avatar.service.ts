import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Photo } from '@capacitor/camera';
import { User } from '../models/user';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  user: User;
  photoUrl: string;

  constructor(private ngFireAuth: AngularFireAuth, public afStore: AngularFirestore, public storage: AngularFireStorage) {
    this.user = JSON.parse(localStorage.getItem('user'));
   }

  getUserProfile(){ 
    if(this.user) {
      const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.user.uid}`
      );
      return userRef.get()
    }
  }

  updateUserProfile(uid, data): Promise<void> {
    return this.afStore.doc(`users/${uid}`).update(data);
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoUrl: user?.photoUrl,
      emailVerified: user?.emailVerified
    };
    return userRef.set(userData, { merge: true });
  }

  async uploadImage(cameraFile: string) {
    const user = await this.ngFireAuth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const imageRef = this.storage.ref(path);

    try {
      await imageRef.putString(cameraFile, 'data_url');
      const imageUrl = await imageRef.getDownloadURL();
      return imageUrl;
    } catch (e) {
      return null;
    }
  }
}
