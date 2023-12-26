import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';

import {
  getDatabase,
  set,
  ref,
  onValue,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCtqojc7G5Uu6MWflylxW8ay3LjLc-corw',
  authDomain: 'piper-mate.firebaseapp.com',
  projectId: 'piper-mate',
  storageBucket: 'piper-mate.appspot.com',
  messagingSenderId: '956834920434',
  appId: '1:956834920434:web:22eff2ecfc78452b5a1d6b',
  measurementId: 'G-YPR95S1VV0',
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export function writeData(
  name,
  age,
  sex,
  country,
  hamiltonScore,
  montScore,
  qidsScore
) {
  const dataRef = ref(database, 'users');
  readData().then((oldData) => {
    let newData = [];
    if (oldData) {
      newData = oldData.data;
    }

    newData.push({
      name,
      age,
      sex,
      country,
      hamiltonScore,
      montScore,
      qidsScore,
    });

    set(dataRef, { data: newData });
  });
}

export function readData() {
  const dataRef = ref(database, 'users/');
  return new Promise((resolve, reject) => {
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        resolve(data);
      } else {
        resolve(null);
      }
    });
  });
}

// writeData('sonet', 33, 'm', 'bd', 44, 33, 22);

// readData().then((mama) => {
//   console.log(mama);
// });
