import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: User;

  constructor(private avatarService: AvatarService, private ngFireAuth: AngularFireAuth, private authService: AuthenticationService,
     private alertController: AlertController, private toastController: ToastController) {
    this.avatarService.getUserProfile().subscribe(user => {
      this.user = user.data();
    });
   }

  ionViewWillEnter() {
    this.avatarService.getUserProfile().subscribe(user => {
      this.user = user.data();
    });
  }

  ngOnInit() {
  }

  passwordRecover() {
    this.authService.PasswordRecover(this.user.email);
  }

  signOut() {
    this.authService.SignOut();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Biztosan szeretnéd törölni a profilod?',
      message: 'Amennyiben törlöd a prodilod nem fogod tudni használni az alkalmazást.',
      buttons: [
        {
          text: 'Mégse',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
        }, {
          text: 'Törlés',
          id: 'confirm-button',
          handler: () => {
            this.deleteUser();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  deleteUser() {
    this.authService.DeleteUser().then(async () => {
      await this.presentToast("A profilodat sikeresen töröltük az adatbázisból.");
    })
    .catch(async(error) => {
      await this.presentToast("Valami hiba történt.")
      console.log(error);
    })
  }

}
