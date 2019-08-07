///==================================================
///Puerto
///==================================================

process.env.PORT = process.env.PORT || 3000;


///==================================================
///Entorno
///==================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

///==================================================
///DB
///==================================================

let UrlDB;
if (process.env.NODE_ENV === 'dev') {
    UrlDB = 'mongodb://localhost:27017/Cafe';
} else {
    UrlDB = 'mongodb+srv://UdemyJuanAR:rh8Uzr1Megezr77z@udemyjm-cudok.mongodb.net/Cafe';
}

//MongoDB: mongodb + srv: //UdemyJuanAR:<password>@udemyjm-cudok.mongodb.net/test

process.env.URLDB = UrlDB;