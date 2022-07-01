import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userData: FormGroup;

  constructor(private toastController: ToastController, public authService: AuthenticationService, public router: Router, private alertController: AlertController) { }

  ngOnInit() {
    this.userData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  signUp() {
    this.authService.RegisterUser(this.userData.controls.email.value, this.userData.controls.password.value)
      .then(async (res) => {
        this.router.navigate(['login']);
        const toast = await this.toastController.create({
          message: 'Sikeres regisztráció. Mostmár bejelentkezhetsz a fiókodba.',
          duration: 2000
        });
        toast.present();
        
        const user: User = {
          email: this.userData.controls.email.value
        };
        this.authService.SetUserData(user);
      }).catch(async(error) => {
        const alert = await this.alertController.create({
          header: 'Hiba a regisztráció során!',
          message: this.convertMessage(error.code),
          buttons: ['Újra'],
        });
        await alert.present();
      });
  }

  convertMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use': {
          return 'Ez az email cím már regisztrálva van';
      }
      case 'auth/operation-not-allowed': {
          return 'A regisztráció nem lehetséges, ezzel a email címmel és jelszóval';
      }
      case 'auth/invalid-email': {
          return 'Email cím nem megfelelő';
      }
      case 'auth/weak-password': {
          return 'Gyenge jelszó';
      }
      default: {
          return 'Valami hiba történt a regisztráció során, kérjük próbáld meg újra';
      }
    }
  }
}
