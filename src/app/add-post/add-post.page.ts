import { Component, OnInit } from '@angular/core';
import { Post } from '../model/post.model';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { addDoc, collection, Firestore } from 'firebase/firestore';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  post = {} as Post;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: Firestore // Importa Firestore desde el módulo configurado
  ) { }

  ngOnInit() { }

  async createPost(post: Post) {
    // Validar formulario
    if (this.formValidation()) {
      // Mostrar cargador
      let loader = await this.loadingCtrl.create({
        message: 'Espere un momento por favor...',
      });
      await loader.present();

      try {
        // Crear documento en la colección "posts"
        const postsCollection = collection(this.firestore, 'posts');
        await addDoc(postsCollection, post);

        // Redirigir al home después de agregar el post
        this.navCtrl.navigateRoot('home');
      } catch (e: any) {
        // Manejar errores
        this.showToast(e.message || 'Error al crear el post');
      } finally {
        // Ocultar el cargador
        await loader.dismiss();
      }
    }
  }

  // Validación del formulario
  formValidation(): boolean {
    if (!this.post.title) {
      this.showToast('Ingrese un título');
      return false;
    }
    if (!this.post.details) {
      this.showToast('Ingrese una descripción');
      return false;
    }
    return true;
  }

  // Mostrar mensaje emergente
  showToast(message: string) {
    this.toastCtrl
      .create({
        message,
        duration: 5000,
      })
      .then((toastData) => toastData.present());
  }
}
