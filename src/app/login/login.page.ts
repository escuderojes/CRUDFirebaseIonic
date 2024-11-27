import { Component, OnInit } from '@angular/core';
import { User } from "../model/user.model";
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;
  constructor(
    private toastCtrl: ToastController, // Controlador para mostrar mensajes emergentes
    private loadingCtrl: LoadingController, // Controlador para mostrar indicadores de carga
    private afAuth: AngularFireAuth, // Servicio de autenticación con Firebase
    private navCtrl: NavController // Servicio para la navegación entre páginas
  ) { }
  ngOnInit() {
  }
  async login(user: User) {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere un momento por favor..."
      });
      await loader.present();

      try {
        await this.afAuth.signInWithEmailAndPassword(user.email, user.password).then(data => {
          console.log(data);
          this.navCtrl.navigateRoot("home");
        });
      } catch (e: any) {
        e.message = "Usuario no registrado";
        let errorMessage = e.message || e.getLocalizedMessage();
        this.showToast(errorMessage);
      }

      await loader.dismiss();
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
        duration: 5000, // Duración del mensaje
      })
      .then(toastData => toastData.present());
  }
}
