import { Component, OnInit } from '@angular/core';
import { EventI } from '../models/event.interface';
import { EventService } from '../services/event.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  events: EventI[];

  constructor(private eventService: EventService, private alertController: AlertController) {}

  ngOnInit(){
    this.eventService.getEvents().subscribe(res => this.events = res);
  }

  async onRemove( eventId: string ){

    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Deseas eliminar este evento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Confirm Okay');
            this.eventService.removeEvent(eventId);
          }
        }
      ]
    });

    await alert.present();

  }

}
