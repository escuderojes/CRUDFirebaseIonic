// firebase-config.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment'; // Ruta al archivo environment.ts

// Inicialización de Firebase con la configuración
const app = initializeApp(environment.FIREBASE_CONFIG);

// Inicialización de Firestore
export const firestore = getFirestore(app);
