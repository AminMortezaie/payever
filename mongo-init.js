db = db.getSiblingDB('payever');

db.createUser({
  user: 'admin',
  pwd: 'secretpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'payever'
    }
  ]
}); 