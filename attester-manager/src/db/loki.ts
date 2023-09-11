import * as loki from 'lokijs';

const db = new loki('./attester.db', {
  autoload: true,
  autosave: true,
  autosaveInterval: 1000,
  autosaveCallback: () => {
    console.log('autosaved db');
  },
  autoloadCallback: init,
});

function init() {
  const requests = db.getCollection('requests');

  if (requests === null) {
    db.addCollection('requests', { autoupdate: true });
  }
}

export default db;
