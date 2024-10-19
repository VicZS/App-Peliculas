import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Genre, Pelicula, PeliculaDetalle } from '../interfaces/interfaces';
import { DataLocalService } from '../services/data-local.service';
import { MoviesService } from '../services/movies.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy{

  //peliculas: PeliculaDetalle[]=[];
  peliculas: Pelicula[]=[];
  generos: Genre[]=[];

  favoritoGenero: any[]=[];

  modalClosedSubscription: Subscription | null = null;

  constructor( private dataLocal: DataLocalService,
    private moviesService:MoviesService
  ) {}

  ngOnInit() {
    this.modalClosedSubscription = this.dataLocal.modalClosed.subscribe(() => {
      this.ionViewWillEnter();
    });
  }

  async ionViewWillEnter(){
    this.peliculas = await this.dataLocal.cargarFavoritos();
    this.generos = await this.moviesService.cargarGeneros();

    this.pelisPorGenero(this.generos, this.peliculas);
  }

  pelisPorGenero( generos: Genre[], peliculas: PeliculaDetalle[]){

    this.favoritoGenero = [];

    generos.forEach(genero => {

      this.favoritoGenero.push({
        genero: genero.name,
        pelis: peliculas.filter(peli => {
          return peli.genres && peli.genres.find((genre:any)=> genre.id === genero.id);
        })
      });
    });

    console.log(this.favoritoGenero)

  }

  ngOnDestroy() {
    if (this.modalClosedSubscription) {
      this.modalClosedSubscription.unsubscribe();
    }
  }

}
