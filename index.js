const express = require("express");
const app = express();
const cors = require("cors");
const { config } = require('dotenv');
config()
console.log(process.env.SendGrid);
const multer = require("multer");
const firebase = require("firebase/app");
const { initializeApp } = require("firebase/app")
const { getStorage, getDownloadURL, ref, uploadBytes, listAll, deleteObject } = require("firebase/storage");
const { getFirestore, collection, addDoc, setDoc, doc, getDocs, getDocFromCache, getDoc, deleteDoc } = require("firebase/firestore");
const { sendWelcomeEmail } = require("./mail");

var bodyParser = require("body-parser");
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({ extended: true }));
// number to digit converter
function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// Nithish 
// const Nfire = {

//     apiKey: "AIzaSyDaKCByiwY4DHgeH7MPEG9XTLtnTkQ8H4o",

//     authDomain: "northwestconference-e048f.firebaseapp.com",

//     projectId: "northwestconference-e048f",

//     storageBucket: "northwestconference-e048f.appspot.com",

//     messagingSenderId: "335112680242",

//     appId: "1:335112680242:web:211379e3381d5ebcdadd2b",

//     measurementId: "G-M0LXWCS31B",

// };
// // firebase.initializeApp(Nfire, 'Nfirebase');
// const napp = initializeApp(Nfire, 'Nithish')
// const db = getFirestore(napp)
// Konda
// const KondaFire = {
//     apiKey: "AIzaSyCBgZmxqcVOX6uhmCxlYISmE8shIwhHJzQ",
//     authDomain: "nwconf2023.firebaseapp.com",
//     projectId: "nwconf2023",
//     storageBucket: "nwconf2023.appspot.com",
//     messagingSenderId: "95550327697",
//     appId: "1:95550327697:web:42898318ee7ec26a9ce830",
//     measurementId: "G-XT6S761638"
// };
// // firebase.initializeApp(KondaFire, 'Kfirebase');
// const fapp = initializeApp(KondaFire, 'Konda')
// const db = getFirestore(fapp)
//Common Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCvXZCM6idJo4GQ8K395_LRLUmeCBQsM8",
    authDomain: "northwestconference-84224.firebaseapp.com",
    projectId: "northwestconference-84224",
    storageBucket: "northwestconference-84224.appspot.com",
    messagingSenderId: "211290130504",
    appId: "1:211290130504:web:d0ad3bc51b67583c7db07d",
    measurementId: "G-8D0MTZY27N"
};
const fapp = initializeApp(firebaseConfig)
const db = getFirestore(fapp)
const storage = getStorage(fapp);
app.get("/getpapers/:id", async(req, res) => {
    console.log(req.params.id);
    const docRef = doc(db, "submissions", req.params.id);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data());
            var data = []
            data.push(docSnap.data())
            res.send(data);

        } else {
            console.log("Document does not exist")
            res.send('No Sub');

        }

    } catch (error) {
        console.log(error)
        res.json('No valid info')
    }
    // res.json("Fireba  se Storage");
});
// nithish login 
app.post("/authreg", (req, res) => {
    const itemRef = collection(db, "users");
    var data = {...req.body };
    console.log(data);
    addDoc(itemRef, data)
        .then(() => {
            console.log("Enter the Data");
            sendWelcomeEmail(data.Email, data.FirstName);
        })
        .catch(() => {
            console.log("An Error occured");
        });
    res.status(200).send({ message: "New User saved" });
});
// nithish Reg
app.post("/authlogin", upload.single(), async(req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
    console.log(email);
    console.log(password);

    await getDocs(collection(db, "users")).then((snap) => {
        var some = snap.docs[0].data();
        // console.log(snap.docs[0].id);
        var some2 = [];
        snap.docs.forEach((doc) => {
            var temp = [];
            temp.push(doc.id);
            temp.push(doc.data());
            some2.push(temp);
        });
        some2.forEach(s => {
            // console.log(s[1]);
        })
        var final = some2.filter((s) => {
            return s[1].Email == email && s[1].Password == password;
        });

        // console.log(final);
        if (final.length > 0) {
            res.send(final);
        } else {
            var error = "Wrong data";
            res.send(error);
        }
        console.log(final);
    }).catch(e => {
        console.log(e);
    });

});



app.post("/committeelogin", upload.single(), async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
    await getDocs(collection(db, "committee")).then((snap) => {
      var some = snap.docs[0].data();
      console.log(snap.docs[0].id);
      var some2 = [];
      snap.docs.forEach((doc) => {
        var temp = [];
        temp.push(doc.id);
        temp.push(doc.data());
        some2.push(temp);
      });
      some2.forEach(s=>{
        // console.log(s[1]);
      })
      var final = some2.filter((s) => {
        return s[1].Email == email && s[1].Password == password;
      });
  
      // console.log(final);
      if (final.length > 0) {
        res.send(final);
      } else {
        var error = "Wrong data";
        res.send(error);
      }
      // console.log(final);
    });
  
  });
  
  app.post("/committeereg", (req, res) => {
    const itemRef = collection(db, "committee");
    var data = { ...req.body };
    console.log(data);
    addDoc(itemRef, data)
      .then(() => {
        console.log("Enter the Data");
        sendWelcomeEmail(data.Email, data.FirstName);
      })
      .catch(() => {
        console.log("An Error occured");
      });
  
    res.status(200).send({ message: "File uploaded successfully" });
  });
  
  app.post("/guest", (req, res) => {
    console.log("Geust payment")
    const itemRef = collection(db, "guest");
    var data = { ...req.body };
    console.log(data);
    addDoc(itemRef, data)
      .then(() => {
        paymentConfirmationMail(data.Email, data.FirstName,data.Amount,data.Phone,data.Status,data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  
    res.status(200).send({ message: "Payment successfull" });
  });
  
app.post('/delete/:id', async(req, res) => {
    console.log(req.params.id);
    const docRef = doc(db, 'submissions', req.params.id);
    var data = []
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data());
            data.push(docSnap.data())
            res.send(data);
        } else {
            console.log("Document does not exist")
            res.send('No Sub');

        }
        console.log(data[0].fileURL.length);
        if (data[0].fileURL.length > 10) {
            var path = ""
                // const directoryRef = ref(storage, `files/${req.params.id}`);
            const directoryRef = ref(storage, `files/${req.params.id}`);
            // List all items in the directory
            await listAll(directoryRef)
                .then((res) => {
                    console.log('came here');
                    // Loop through each file and log its path
                    res.items.forEach((fileRef) => {
                        console.log(fileRef.fullPath);
                        path = fileRef.fullPath
                        var fileRef = ref(storage, path);
                        // Delete the file
                        deleteObject(fileRef)
                            .then(() => {
                                console.log(`File  deleted successfully`);
                                const docRef = doc(db, `submissions/${req.params.id}`);
                                // Call the delete() method to drop the entire document
                                deleteDoc(docRef)
                                    .then(() => {
                                        console.log("Document successfully dropped.");
                                    })
                                    .catch((error) => {
                                        console.error("Error dropping document:", error);
                                    });
                            })
                            .catch((error) => {
                                console.log(`Error deleting file`, error);
                            });
                    });

                })
                .catch((error) => {
                    console.log(`Error listing files in directory: ${directoryRef}`, error);
                });
        } else {
            const docRef = doc(db, `submissions/${req.params.id}`);
            // Call the delete() method to drop the entire document
            await deleteDoc(docRef)
                .then(() => {
                    console.log("Document successfully dropped.");

                })
                .catch((error) => {
                    console.error("Error dropping document:", error);
                });
        }
    } catch (error) {
        console.log(error)
            // res.json('No valid info')
    }
})
app.post('/edit', upload.single('file'), async(req, res) => {
    const file = req.file;
    console.log(req.body);
    var before = []
    const docRef = doc(db, 'submissions', req.body.id);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data());
            before.push(docSnap.data())
        } else {
            console.log("Document does not exist")
        }
        console.log(before[0].fileURL.length);
        if (before[0].fileURL.length > 10) {
            console.log(
                '%c%s %c%s %c%s',
                "color:red",
                "string replacement (red)",
                "color:green",
                "string replacement (green)",
                "color:blue",
                "string replacement (blue)"
            );
            var path = ""
                // const directoryRef = ref(storage, `files/${req.params.id}`);
            const directoryRef = ref(storage, `files/${req.body.id}`);
            // List all items in the directory
            await listAll(directoryRef)
                .then((res) => {
                    console.log('came here');
                    // Loop through each file and log its path
                    res.items.forEach((fileRef) => {
                        console.log(fileRef.fullPath);
                        path = fileRef.fullPath
                        var fileRef = ref(storage, path);
                        // Delete the file
                        deleteObject(fileRef)
                            .then(() => {
                                console.log(`File  deleted successfully`);
                                const docRef = doc(db, `submissions/${req.body.id}`);
                                // Call the delete() method to drop the entire document
                                deleteDoc(docRef)
                                    .then(() => {
                                        console.log("Document successfully dropped.");
                                    })
                                    .catch((error) => {
                                        console.error("Error dropping document:", error);
                                    });
                            })
                            .catch((error) => {
                                console.log(`Error deleting file`, error);
                            });
                    });

                })
                .catch((error) => {
                    console.log(`Error listing files in directory: ${directoryRef}`, error);
                });
        }
    } catch (error) {
        console.log(error)
            // res.json('No valid info')
    }

    if (req.file) {
        console.log('file');
        const storageRef = ref(storage, `files/${req.body.id}/${req.file.originalname}`);
        uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
            console.log("file uploaded");
            getDownloadURL(storageRef).then(url => {
                return url
            }).then((url) => {
                const docRef = doc(db, "submissions", req.body.id);
                var data = req.body
                var Fuser = JSON.parse(req.body.Udetails)
                data = {...req.body }
                data['fileURL'] = url
                console.log(before[0]['paperID']);
                data['paperID'] = `${before[0]['paperID']}`
                console.log(data);
                setDoc(docRef, data)
                    .then(docRef => {
                        console.log("Entire Document has been updated successfully");
                        if (data.emails != undefined) {
                            var temp = Fuser.Email + "," + data.emails
                            var array = temp.split(',');
                            console.log(array);
                            try {
                                sendWelcomeEmail(array, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your re-submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)

                            } catch (error) {

                            }

                        } else {
                            try {
                                sendWelcomeEmail(Fuser.Email, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your re-submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)
                            } catch (error) {

                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
        })
    } else {
        console.log('no file');
        const docRef = doc(db, "submissions", req.body.id);
        var data = req.body
        var Fuser = JSON.parse(req.body.Udetails)
        url = "N/A"
        data['fileURL'] = url
        data['paperID'] = `${before[0]['paperID']}`
        setDoc(docRef, data)
            .then(docRef => {
                console.log("Entire Document has been updated successfully");
                if (data.emails != undefined) {
                    console.log(data.emails);
                    console.log("server got emails");
                    var temp = Fuser.Email + "," + data.emails
                    var array = temp.split(',');
                    console.log(array);
                    try {
                        sendWelcomeEmail(array, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your re-submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nwe have noticed that you have'nt submitted your Paper \n*File upload will be available till 5th  May 2023\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)

                    } catch (error) {

                    }

                } else {
                    try {
                        sendWelcomeEmail(Fuser.Email, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your re-submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nwe have noticed that you have'nt submitted your Paper \n*File upload will be available till 5th  May 2023\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)

                    } catch (error) {

                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    res.status(200).send({ message: 'File uploaded successfully' });
});

app.post('/', upload.single('file'), async(req, res) => {

    const file = req.file;
    console.log(req.body);
    var some2 = [];

    // get no.of submissions
    await getDocs(collection(db, "submissions")).then((snap) => {
        some2 = [];
        snap.docs.forEach((doc) => {
            var temp = [];
            temp.push(doc.id);
            temp.push(doc.data());
            some2.push(temp);
        });
        console.log("total are" + some2.length);
    }).catch(e => {
        console.log(e);
    });
    const docRef = doc(db, "submissions", req.body.id);
    var undi = false
    var befores = []
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            undi = true
            console.log(docSnap.data());
            befores = []
            befores.push(docSnap.data())

        } else {
            console.log("Document does not exist")

        }

    } catch (error) {
        console.log(error)
        res.json('No valid info')
    }

    console.log("total are :" + pad(some2.length, 3));
    if (req.file) {
        const storageRef = ref(storage, `files/${req.body.id}/${req.file.originalname}`);
        uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
            console.log("file uploaded");
            getDownloadURL(storageRef).then(url => {
                return url
            }).then((url) => {
                const docRef = doc(db, "submissions", req.body.id);
                var data = req.body
                var Fuser = JSON.parse(req.body.Udetails)
                data = {...req.body }
                data['fileURL'] = url
                var count = some2.length + 1
                if (undi) {
                    data['paperID'] = befores[0]['paperID']
                } else {
                    data['paperID'] = pad(count, 3)
                }

                console.log(data);
                setDoc(docRef, data)
                    .then(docRef => {
                        console.log("Entire Document has been updated successfully");
                        if (data.emails != undefined) {
                            var temp = Fuser.Email + "," + data.emails
                            var array = temp.split(',');
                            console.log(array);
                            try {
                                sendWelcomeEmail(array, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)

                            } catch (error) {

                            }

                        } else {
                            try {
                                sendWelcomeEmail(Fuser.Email, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)
                            } catch (error) {

                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
        })
    } else {
        console.log('no file');
        const docRef = doc(db, "submissions", req.body.id);
        var data = req.body
        var Fuser = JSON.parse(req.body.Udetails)
        url = "N/A"
        data['fileURL'] = url
        var count = some2.length + 1
        if (undi) {
            data['paperID'] = befores[0]['paperID']
        } else {
            data['paperID'] = pad(count, 3)
        }
        console.log(data);
        setDoc(docRef, data)
            .then(docRef => {
                console.log("Entire Document has been updated successfully");
                if (data.emails != undefined) {
                    console.log(data.emails);
                    console.log("server got emails");
                    var temp = Fuser.Email + "," + data.emails
                    var array = temp.split(',');
                    console.log(array);
                    try {
                        sendWelcomeEmail(array, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nwe have noticed that you have'nt submitted your Paper \n*File upload will be available till 5th  May 2023\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)

                    } catch (error) {

                    }

                } else {
                    try {
                        sendWelcomeEmail(Fuser.Email, Fuser.FirstName, `Dear ${Fuser.FirstName},\nThank you for your submission. We have received your submission and will review it as soon as possible. We appreciate your interest and we look forward to working with you.\nwe have noticed that you have'nt submitted your Paper \n*File upload will be available till 5th  May 2023\nThis is your Paper submission ID - ${data['paperID']}\nBest regards,\nSubmission Department,\nNorthwest Conference 2023`)

                    } catch (error) {

                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    res.status(200).send({ message: 'File uploaded successfully' });
});

app.listen(5000, () => {
    console.log("backend server turned on");
});