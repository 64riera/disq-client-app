import { Component, OnInit } from '@angular/core';
import { EventI } from '../../models/event.interface';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular'; 
import { locateDirectiveOrProvider } from '@angular/core/src/render3/di';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  event: EventI = {
    artist: '',
    date: '',
    description: '',
    place: '',
    title: ''
  }

  eventId = null;

  constructor(private route: ActivatedRoute, private nav: NavController, private eventService: EventService, private loadingController: LoadingController, private alertController: AlertController) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    if (this.eventId) {
      this.loadEvent();
    }
  }

  async loadEvent(){
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
    this.eventService.getEvent(this.eventId).subscribe(res => {
      loading.dismiss();
      this.event = res;
    });
  }

  async saveEvent(){
    
    if ( this.event.artist == '' || this.event.date == '' || this.event.description == '' || this.event.place == '' || this.event.title == '') {
      this.onEmpty();
    } else {

      const loading = await this.loadingController.create({
        message: 'Publicando...'
      });
      await loading.present();
  
      if (this.eventId) {
        //Update
        this.eventService.updateEvent(this.event, this.eventId).then(() => {
          loading.dismiss();
          this.nav.navigateForward('/');
        });
  
      } else {
        //Save
        this.eventService.addEvent(this.event).then(() => {
          loading.dismiss();
          this.nav.navigateBack('/');
        });
  
      }

    }
    
  }

  async onRemove(idEvent: string){

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
          text: 'Sí, eliminar',
          handler: () => {
            console.log('Confirm Okay');
            this.eventService.removeEvent(idEvent);
            this.nav.navigateForward('/');
          }
        }
      ]
    });

    await alert.present();
    
  }

  async onEmpty(){

    const alert = await this.alertController.create({
      header: 'Datos no válidos',
      message: 'Llene todos los campos para continuar',
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
    
  }

}
