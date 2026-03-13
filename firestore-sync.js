class FirestoreSync {
  constructor() {
    this.db = firebase.firestore();
  }

  onCamerasChange(callback) {
    return this.db.collection('cameras')
      .where('isActive', '==', true)
      .onSnapshot(snap => {
        const cameras = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(cameras);
      });
  }

  onMonitoredPlatesChange(callback) {
    return this.db.collection('monitoring')
      .where('isActive', '==', true)
      .onSnapshot(snap => {
        const plates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(plates);
      });
  }

  onEventsChange(callback) {
    return this.db.collection('events')
      .orderBy('captured_at', 'desc')
      .limit(100)
      .onSnapshot(snap => {
        const events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(events);
      });
  }

  onAlertsChange(callback) {
    return this.db.collection('alerts')
      .where('isRead', '==', false)
      .orderBy('captured_at', 'desc')
      .limit(50)
      .onSnapshot(snap => {
        const alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(alerts);
      });
  }
}

const firestoreSync = new FirestoreSync();