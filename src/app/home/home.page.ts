import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from '../model/post.model'; // Asegúrate de tener este modelo

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  posts: any;
  post: Post = {
    title: '',
    details: ''
  };

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore
  ) { }

  ionViewWillEnter() {
    this.getPosts();
  }

  // Método para obtener posts de Firestore
  async getPosts() {
    let loader = await this.loadingCtrl.create({
      message: 'Espere un momento por favor..',
    });
    await loader.present();

    try {
      this.firestore
        .collection('posts')
        .snapshotChanges()
        .subscribe((data: any[]) => {
          this.posts = data.map((e: any) => {
            return {
              id: e.payload.doc.id,
              title: e.payload.doc.data()['title'],
              details: e.payload.doc.data()['details'],
            };
          });
        });
      await loader.dismiss();
    } catch (e: any) {
      e.message = 'MENSAJE DE ERROR DEL HOME';
      let errorMessage = e.message || e.getLocalizedMessage();
      this.showToast(errorMessage);
    }
  }

  // Método para eliminar un post
  async deletePost(id: string) {
    let loader = await this.loadingCtrl.create({
      message: 'Espere un momento...',
    });
    await loader.present();

    await this.firestore.doc('posts/' + id).delete();
    await loader.dismiss();
  }

  // Método para crear un nuevo post
  async createPost() {
    if (this.post.title && this.post.details) {
      let loader = await this.loadingCtrl.create({
        message: 'Creando post...',
      });
      await loader.present();

      try {
        // Añadir post a Firestore
        await this.firestore.collection('posts').add(this.post);
        this.showToast('Post creado exitosamente!');
        this.post = { title: '', details: '' }; // Limpiar el formulario
        await loader.dismiss();
        this.getPosts(); // Actualizar la lista de posts
      } catch (error: any) {
        await loader.dismiss();
        this.showToast('Error al crear el post: ' + error.message);
      }
    } else {
      this.showToast('Por favor, complete todos los campos.');
    }
  }

  // Método para mostrar mensajes emergentes
  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 5000,
    }).then((toastData) => toastData.present());
  }
}
