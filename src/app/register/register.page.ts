import { Component, OnInit } from '@angular/core';
import { User } from "../model/user.model";
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Definimos un objeto 'user' del tipo 'User'
  user = {} as User;

  constructor(
    private toastCtrl: ToastController, // Controlador para mostrar mensajes emergentes
    private loadingCtrl: LoadingController, // Controlador para mostrar indicadores de carga
    private afAuth: AngularFireAuth, // Servicio de autenticación con Firebase
    private navCtrl: NavController // Servicio para la navegación entre páginas
  ) { }

  // Método de inicialización (necesario para la interfaz OnInit)
  ngOnInit() { }

  // Método principal para registrar un usuario
  async register(user: User) {
    // Llamamos al método formValidation()
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere por favor..",
      });
      await loader.present(); // Mostramos el indicador de carga

      try {
        // Intentamos registrar al usuario con Firebase Authentication
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(data => {
          console.log(data);
          this.navCtrl.navigateRoot("home"); // Navegamos a la página "home"
        });
      } catch (e: any) {
        // Capturamos cualquier error y mostramos un mensaje de error
        let errormessage = e.message || e.getLocalizedMessage();
        this.showToast(errormessage); // Mostramos el error en un mensaje emergente
      }

      await loader.dismiss(); // Ocultamos el indicador de carga
    }
  }

  // Método para validar los datos del formulario
  formValidation(): boolean {
    if (!this.user.email) {
      this.showToast("Ingrese un email"); // Mostramos un mensaje si no hay email
      return false;
    }
    if (!this.user.password) {
      this.showToast("Ingrese una clave"); // Mostramos un mensaje si no hay clave
      return false;
    }
    return true; // Retornamos true si ambos campos están completos
  }

  // Método para mostrar mensajes emergentes
  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message, // Mensaje a mostrar
        duration: 4000, // Duración del mensaje
      })
      .then(toastData => toastData.present());
  }
}
