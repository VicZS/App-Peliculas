import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Pelicula } from '../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../components/detalle/detalle.component';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  textoBuscar = '';
  buscando = false;
  peliculas: Pelicula[]=[];
  ideas: string[] = ['SpiderMan', 'Avenger', 'El señor de los anillos', 'La vida es bella'];

  constructor(private moviesService:MoviesService,
    private modalCtrl:ModalController
  ){}

  buscar(event: any){
    //console.log(event);
    const valor = event.detail.value;
    //console.log(valor)
    this.buscando=true;

    this.moviesService.buscarPeliculas(valor)
      .subscribe((resp:any)=>{
        console.log(resp);
        this.peliculas = resp['results'];
        this.buscando=false;
      })
  }

  seleccionarIdea(idea: string) {
    this.textoBuscar = idea;
    const customEvent = { detail: { value: idea } };
    this.buscar(customEvent);
  }

  async detalle(id: number){
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps:{
        id
      }
    });

    modal.present();
  }



  // onSearch(event: CustomEvent) {
  //   const searchTerm = (event.target as HTMLInputElement).value;
  //   this.delayedConsoleLog(searchTerm);
  // }

  // delayedConsoleLog(value: string) {
  //   setTimeout(() => {
  //     console.log('Texto después de 2 segundos:', value);
  //   }, 100);
  // }

}
