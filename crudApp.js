const loki = require('lokijs');
const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');


// Console
const consoleApp = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Database
const db = new loki('database.db');
const contacts = db.addCollection('contacts');

// Fill database
CSVtoDB();

// App
launchConsoleApp();

// FONCTIONS

// CSV to database
function CSVtoDB() {
  fs.createReadStream('contacts.csv')
    .pipe(csv())
    .on('data', (row) => {
      contacts.insert(row);
    })
    .on('end', () => {
      // console.log('Insertion des données terminée.');
    });
}

// Console app
function launchConsoleApp() {
  console.log('\nAppuyez sur la touche Entrée pour commencer.');
  consoleApp.question('', () => {
    console.log('===== Contact App =====');
    console.log('1. Afficher un contact');
    console.log('2. Créer un contact');
    console.log('3. Mettre à jour un contact');
    console.log('4. Supprimer un contact');
    console.log('5. Afficher tous les contacts (à éviter)');
    console.log('6. Quitter');
    console.log('==========================');

    consoleApp.question('\nChoisissez une option : ', (option) => {
      switch (option) {
        case '1':
          getContact()
          break;
        case '2':
          createContact()
          break;
        case '3':
          updateContactF();
          break;
        case '4':
          deleteContactF();
          break;
        case '5':
          displayAllContacts();
          break;
        case '6':
          console.log('\nMerci d\'avoir utiliser notre applicatio !');
          consoleApp.close();
          break;
        default:
          console.log('Option invalide.');
          launchConsoleApp()
          break;
      }
    });
  })
}

function displayContact(contact) {
  console.log('\n===== Détails du contact =====');
  console.log('ID : ', contact.$loki);
  console.log('Titre : ', contact.title);
  console.log('Nom : ', contact.name);
  console.log('Adresse : ', contact.adress);
  console.log('Adresse réelle : ', contact.realAdress);
  console.log('Département : ', contact.departement);
  console.log('Pays : ', contact.country);
  console.log('Téléphone : ', contact.tel);
  console.log('Email : ', contact.email);
  console.log('==============================');
}

// Create
function createContact() {
  console.log('===== Créer un contact =====');
  consoleApp.question('Titre : ', (title) => {
    consoleApp.question('Nom : ', (name) => {
      consoleApp.question('Adresse : ', (address) => {
        consoleApp.question('Adresse réelle : ', (realAddress) => {
          consoleApp.question('Département : ', (department) => {
            consoleApp.question('Pays : ', (country) => {
              consoleApp.question('Téléphone : ', (tel) => {
                consoleApp.question('Email : ', (email) => {

                  const data = {
                    title: title,
                    name: name,
                    address: address,
                    realAddress: realAddress,
                    department: department,
                    country: country,
                    tel: tel,
                    email: email
                  };
  
                  contacts.insert(data);
                  console.log('\nContact crée avec succès ! avec l\'id : ' + data.$loki);
                  displayContact(data);

                  launchConsoleApp()
                });
              });
            });
          });
        });
      });
    });
  });
}

// Read
function getContact() {
  consoleApp.question('Choisissez un id : ', (option) => {
    const optionInt = parseInt(option);
    if (isNaN(optionInt)) {
      console.log('Veuillez entrer un nombre');
      getContact();
    } else {
      const contact = getContactById(optionInt);
      if(contact) {
        displayContact(contact);
        launchConsoleApp()
      } else {
        console.log('Aucun contact trouvé avec cet ID.');
        getContact();
      }
    }
  })
}

function displayAllContacts() {
    contacts.find().forEach(contact => {
        displayContact(contact);
    });
  }

function getContactById(id) {
  return contacts.get(id);
}

// Update

function updateContactF() {
  console.log('\n===== Mettre à jour un contact =====');
  consoleApp.question('ID du contact : ', (id) => {
    const contact = getContactById(id);
    if (contact) {
      displayContact(contact);

      consoleApp.question('Nouveau titre (laissez vide pour conserver la valeur actuelle) : ', (title) => {
        consoleApp.question('Nouveau nom (laissez vide pour conserver la valeur actuelle) : ', (name) => {
          consoleApp.question('Nouvelle adresse (laissez vide pour conserver la valeur actuelle) : ', (address) => {
            consoleApp.question('Nouvelle adresse réelle (laissez vide pour conserver la valeur actuelle) : ', (realAddress) => {
              consoleApp.question('Nouveau département (laissez vide pour conserver la valeur actuelle) : ', (department) => {
                consoleApp.question('Nouveau pays (laissez vide pour conserver la valeur actuelle) : ', (country) => {
                  consoleApp.question('Nouveau téléphone (laissez vide pour conserver la valeur actuelle) : ', (tel) => {
                    consoleApp.question('Nouvel email (laissez vide pour conserver la valeur actuelle) : ', (email) => {

                      const newContactData = {
                        title: title,
                        name: name,
                        address: address,
                        realAddress: realAddress,
                        department: department,
                        country: country,
                        tel: tel,
                        email: email
                      };

                      const updatedContact = updateContact(contact.$loki, newContactData);
                      console.log('\nContact mis à jour avec succès ! Voici le contact mis à jour :');
                      displayContact(updatedContact);

                      launchConsoleApp()
                    });
                  });
                });
              });
            });
          });
        });
      });
    } else {
      console.log('Aucun contact trouvé avec cet ID.');
      updateContactF();
    }
  });
}

function updateContact(id, newContactData) {
  var contact = contacts.get(id);

  contact.title = newContactData.title || contact.title;
  contact.name = newContactData.name || contact.name;
  contact.address = newContactData.address || contact.address;
  contact.realAddress = newContactData.realAddress || contact.realAddress;
  contact.department = newContactData.department || contact.department;
  contact.country = newContactData.country || contact.country;
  contact.tel = newContactData.tel || contact.tel;
  contact.email = newContactData.email || contact.email;

  contacts.update(contact);
  return contact;
}

// Delete
function deleteContactF() {
  consoleApp.question('Choisissez un id : ', (option) => {
    const optionInt = parseInt(option);
    if (isNaN(optionInt)) {
      console.log('Veuillez entrer un nombre');
      deleteContactF();
    } else {
      const contact = getContactById(optionInt);
      if(contact) {
        displayContact(contact);

        consoleApp.question('\nVoulez vous supprimer ce contact ? (y/n) ', (del) => {
          switch(del) {
            case 'y' :
              contacts.remove(contact);
              console.log('Le contact a bien été supprimé !');

              launchConsoleApp()
              break;
            case 'n' :
              console.log('Le contact n\'a pas été supprimé !');

              launchConsoleApp()
              break;
            default :
              console.log('Arrête de la procédure il faut entrer y ou n');

              deleteContactF();
              break;
          }
        })
      } else {
        console.log('Aucun contact trouvé avec cet ID.');
        deleteContactF();
      }
    }
  })
}
