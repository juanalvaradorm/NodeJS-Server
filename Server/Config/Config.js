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
    UrlDB = process.env.CONNECT_URI;
}

//MongoDB: mongodb + srv: //UdemyJuanAR:<password>@udemyjm-cudok.mongodb.net/test

process.env.URLDB = UrlDB;

///==================================================
///End Token
///==================================================
//60 Segundos
//60 Minutos
//24 Horas
//30 Días
//60 * 60 * 24 * 30

process.env.EndToken = 60 * 60 * 40


///==================================================
///SEED authentication
///==================================================

process.env.SeedAuth = process.env.SeedAuth || "este-es-el-seed-desarrollo";