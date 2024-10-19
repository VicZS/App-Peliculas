import { Component, Input, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Cast, PeliculaDetalle } from 'src/app/interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent  implements OnInit {

  @Input() id: any;

  actores:Cast[]=[];
  
  oculto = 150;

  estrella = 'star-outline';

  pelicula: PeliculaDetalle = {};

  constructor( private moviesService:MoviesService,
                private modalCtrl:ModalController,
                private dataLocal:DataLocalService
  ) { }

  ngOnInit() {
    //console.log('ID', this.id)

    this.dataLocal.existePelicula(this.id)
      .then(existe => this.estrella = ( existe ) ? 'star' : 'star-outline');

    this.moviesService.getPeliculaDetalle(this.id)
      .subscribe(resp=>{
        console.log(resp);
        this.pelicula = resp;
      });

    this.moviesService.getActoresPelicula(this.id)
      .subscribe(resp=>{
        console.log(resp);
        this.actores = resp.cast;
      });
  }

  regresar(){
    this.modalCtrl.dismiss().then(() => {
      this.dataLocal.modalClosed.emit();
    });
  }

  async favorito(){
    const existe = this.dataLocal.guardarPelicula(this.pelicula);
    
    this.estrella = ( await existe ) ? 'star' : 'star-outline';
  }

}
