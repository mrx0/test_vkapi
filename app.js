var util = require('util');

var phrases = {
    "Hello": "Привет",
    "world": "мир"
};

function getPhrases (name){
    if (!phrases[name]){
        throw new Error("Нет такой фразы: " + name);
    }
    return phrases[name];
}

function makePage(url){
    if (url != 'index.html'){
        throw new Error("Нет такой страницы");
    }
    return util.format("%s, %s!". getPhrases("Hello"), getPhrases("world"));
}

var page = makePage('index.html');

console.log(page);