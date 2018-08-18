

var user = require('./user');

var vasya = new user.User ("Вася");
var petya = new user.User ("Пётя");

vasya.hello(petya);