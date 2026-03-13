// 
// FIREBASE CONFIGURATION - ZECURE LPR
// 

const firebaseConfig = {
  apiKey: "AIzaSyBf5V1yAmk_X6mN8nR7KjwGH6EO9XalQJ8",
  authDomain: "lpr-arn.firebaseapp.com",
  databaseURL: "https://lpr-arn-default-rtdb.firebaseio.com",
  projectId: "lpr-arn",
  storageBucket: "lpr-arn.firebasestorage.app",
  messagingSenderId: "496945379067",
  appId: "1:496945379067:web:754badd4d6e431e308625e",
  measurementId: "G-58BYD2KNQ5"
};

// Initialize Firebase
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('[Firebase] ✓ Inicializado');
  }
} catch (e) {
  console.error('[Firebase] Erro:', e);
}

// Global refs - CRÍTICO
window.auth = firebase.auth();
window.db = firebase.firestore();
window.messaging = firebase.messaging();

// FIX 1: Configurar cache ANTES de enablePersistence
try {
  window.db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    ignoreUndefinedProperties: true
  });
  console.log('[Firestore] ✓ Cache configurado');
} catch (e) {
  console.warn('[Firestore] Cache (ignorando):', e);
}

// FIX 2: enablePersistence OPCIONAL (pode falhar em modo privado)
window.db.enablePersistence()
  .then(() => console.log('[Firestore] ✓ Offline persistence ativado'))
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firestore] ⚠ Múltiplas abas abertas, offline desativado');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firestore] ⚠ Navegador sem suporte offline');
    }
  });

// FIX 3: Auth state monitoring com flag para evitar redirect em login.html
window.auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('[Auth] ✓ Logado:', user.email);
    // Mostrar app apenas se não estiver em loading
    if (document.body.style.display === 'none') {
      document.body.style.display = 'block';
    }
  } else {
    // Redirecionar APENAS se não estiver em login.html
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login') && !currentPath.includes('index.html') && currentPath !== '/') {
      // Está em outra página (cameras, monitoring, etc)
      console.log('[Auth] ⚠ Redirecionando para login');
      window.location.href = './login.html';
    }
  }
});


console.log('[Config] ✓ Projeto:', firebaseConfig.projectId);
