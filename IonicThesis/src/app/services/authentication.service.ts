import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;

  constructor(public afStore: AngularFirestore, public ngFireAuth: AngularFireAuth, public router: Router, public ngZone: NgZone)
  { 
    this.ngFireAuth.authState.subscribe((user) => {
      if(user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  SendVerificationEmail() {
    return this.ngFireAuth.currentUser.then((user) => {
      return user.sendEmailVerification();
    }).then(() => {
      //return this.router.navigate(['']);
    });
  }

  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Jelszó visszaállító email kiküldve, nézd meg a postaládádat.');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.emailVerified !== null) {
      return user.emailVerified !== false ? true : false;
    } else {
      return false;
    }
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

  AuthLogin(provider) {
    // return this.ngFireAuth.signInWithPopup(provider)
    //   .then((result) => {
    //     this.ngZone.run(() => {
    //       this.router.navigate(['home']);
    //     });
    //     this.SetUserData(result.user);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    this.ngFireAuth.signInWithRedirect(provider);
    return this.ngFireAuth.getRedirectResult().then((result) => {
      this.SetUserData(result.user);
      // this.ngZone.run(() => {
        this.router.navigate(['home']);
      // });
    }).catch ((error) => {
      console.log(error);
    })
  }

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

  async DeleteUser() {
    (await this.ngFireAuth.currentUser).delete().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}
