import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  displayName: string;
  user: User;
  base64: string;

  constructor(private ngFireAuth: AngularFireAuth, private avatarService: AvatarService, private loadingController: LoadingController, private alertController: AlertController, 
    private toastController: ToastController) {
    // this.avatarService.getUserProfile().subscribe(user => {
    //   this.user = user.data();
    // });
    this.ngFireAuth.authState.subscribe((user) => {
      if(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
    this.displayName = "";
  }

  ngOnInit() {
  }

  async changePhoto() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    }).then((result) => {
      this.base64 = result.dataUrl;
      return true;
    });

    if(photo){
      const loading = await this.loadingController.create();
      await loading.present();
      const photoUrlObservable = await this.avatarService.uploadImage(this.base64);
      photoUrlObservable.subscribe(async (resp) => {
        this.avatarService.updateUserProfile(this.user.uid, { photoUrl: resp });
        this.user.photoUrl = resp;
        const toast = await this.toastController.create({
          message: 'Profilképed sikeresen módosítottad',
          duration: 2000
        });
        toast.present();
      },async (error) => {
        const toast = await this.toastController.create({
          message: 'Valami hiba történt',
          duration: 2000
        });
        toast.present();
        console.log(error);
      });
      loading.dismiss();
    }
  }

  async sendUserData() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.avatarService.updateUserProfile(this.user.uid, { displayName: this.displayName}).then(async() => {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Sikeres módosítás',
        message: 'A profilod adatait sikeresen módosítottad',
        buttons: ['Rendben'],
      });
      alert.present();
    }).catch(async(error) => {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Valami hiba történt',
        message: 'Valami hiba történt a módosítás közben, kérjük próbáld meg újra',
        buttons: ['Újra'],
      });
      alert.present();
    });
  }

  async changeDisplayedName() {
    if(this.displayName != "") {
      await this.sendUserData();
    } else {
      const alert = await this.alertController.create({
        header: 'Üres mező',
        message: 'Nem adtál meg nevet',
        buttons: ['Újra'],
      });
      alert.present();
    }
  }

}
