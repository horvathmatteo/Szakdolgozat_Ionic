import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  userData: User;
  
  constructor(public authService: AuthenticationService, public router: Router, private alertController: AlertController, public ngFireAuth: AngularFireAuth,) { 
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

  ngOnInit() {
    this.credentials = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async logIn() {
    this.authService.SignIn(this.credentials.controls.email.value, this.credentials.controls.password.value)
      .then(async(res) => {
        //if(this.userData == null) {
          console.log("bejelentkezés");
          this.router.navigate(['home']);
        //}
        // else if(this.authService.isEmailVerified) {
        //   this.router.navigate(['home']);
        // } else {
        //   const alert = await this.alertController.create({
        //     header: 'Bejelentkezési hiba!',
        //     message: 'Email cím még nincs megerősítve',
        //     buttons: ['Rendben'],
        //   });
        //   await alert.present();
        //   return false;
        // }
      })
      .catch(async (error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: 'Bejelentkezési hiba!',
          message: this.convertMessage(error.code),
          buttons: ['Újra'],
        });
        await alert.present();
      })
  }

  convertMessage(code: string): string {
    switch (code) {
      case 'auth/user-disabled': {
          return 'Sajnáljuk, a felhasználó le lett tiltva';
      }
      case 'auth/user-not-found': {
          return 'Nincs ilyen felhasználó';
      }
      case 'auth/invalid-email': {
          return 'Email cím nem megfelelő';
      }
      case 'auth/wrong-password': {
          return 'Helytelen jelszó';
      }
      default: {
          return 'Valami hiba történt a bejelentkezéskor, kérjük próbáld meg újra';
      }
    }
  }
  
}
