import { Injectable, EventEmitter  } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PeliculaDetalle } from '../interfaces/interfaces';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  peliculas: PeliculaDetalle [] = [];
  modalClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private storage: Storage, private toastCtrl: ToastController) {
    this.init();
    this.cargarFavoritos();

   }

   async presentToast( message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
    });
    toast.present();
   }

  async init() {
    await this.storage.create();
    this.peliculas = await this.storage.get('peliculas') || [];
  }

  async guardarPelicula ( pelicula: PeliculaDetalle ){

    let existe = false;
    let mensaje = '';

    for(const peli of this.peliculas){
      if(peli.id === pelicula.id){
        existe = true;
        break;
      }
    }

    if(existe){
      this.peliculas = this.peliculas.filter(peli => peli.id !== pelicula.id);
      mensaje = 'Removido de favoritos';
    }else{
      this.peliculas.push(pelicula);
      mensaje = 'Agregada a favoritos';
    }

    this.presentToast(mensaje);
    await this.storage.set('peliculas',this.peliculas);

    this.modalClosed.emit();

    return !existe;

  }

  async cargarFavoritos(){
    const peliculas = await this.storage.get('peliculas');
    this.peliculas = peliculas || [];
    return peliculas;
  }

  async existePelicula(id: number){

    await this.cargarFavoritos();
    const existe = this.peliculas.find(peli => peli.id === id);
    return (existe)? true:false ;
  }
}
