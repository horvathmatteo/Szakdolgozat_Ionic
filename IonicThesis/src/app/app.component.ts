import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { AvatarService } from './services/avatar.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user: User;
  public appPages = [
    { title: 'Főoldal', url: 'home', icon: 'home' },
    { title: 'Részletes egyenleg', url: 'detailed-balance', icon: 'cash' },
    { title: 'Számlák', url: 'invoices', icon: 'document' },
    { title: 'Megtakarítások', url: 'savings', icon: 'briefcase' },
    { title: 'Kategóriák', url: 'categories', icon: 'albums'}, 
    { title: 'Exportálás', url: 'export', icon: 'folder-open' },
    { title: 'Profil', url: 'settings', icon: 'settings' },
  ];

  constructor(public authService: AuthenticationService, private menu: MenuController, private avatarService: AvatarService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    if(this.user){
      this.avatarService.getUserProfile().subscribe(user => {
        this.user = user.data();
      });
    }
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  menuOpened(){
    this.user = JSON.parse(localStorage.getItem('user'));
    if(this.user){
      this.avatarService.getUserProfile().subscribe(user => {
        this.user = user.data();
      });
    }
  }
}
