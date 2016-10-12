#!/usr/bin/env node 
const program = require('commander')
const inquirer = require('inquirer')
const db = require('sqlite')
const fs = require('fs')
var theme = 'test'
var usr = ''
var score = 0

// Database connection
db.open('./database.sqlite').then(() => {
//    console.log('connected to database')
}).then(() => {
    return db.run("CREATE TABLE IF NOT EXISTS game (username, theme, score)")
}).then(() => {
//    console.log('table "game" already exists or created')
//    console.log('successfully connected to database')
}).catch((err) => {
    console.error('database error:', err)
})

//Configuration des parametres attendues
program
    .version('1.0.0')
    .option('-H --histoire', 'Theme histoire')
    .option('-g, --geek', 'Theme geek')

// On parse (convertit en format utlisable) les options
program.parse(process.argv)

/*Maintenant on demande les utilisateurs*/
inquirer.prompt([{
    type: 'input',
    message: 'Entrez votre nom d\'utilisateur',
    name: 'username'
}]).then((login) => {
    console.log('Bonjour ' + login.username)
    usr = login.username
    // If pour mode HISTOIRE
    if (program.histoire){
        theme = 'Histoire'
        console.log(theme)
        // Les reponses mode histoire
        const Q1R = 'Catherine de Médicis'
        const Q2R = '1804'
        const Q3R = 'Weeesh 1337 j\'le jure'
        //debut quizz
        return inquirer.prompt([{
            type: 'list',
            message: '1) Qui était l\'épouse d\'Henri II?',
            name: 'Q1',
            choices: [
                'Catherine de Médicis', /*la bonne*/
                'Anne d\'Autriche',
                'Wesh j\'sais pa',
            ]
        },{
            type: 'list',
            message: '2) En quelle année Napoléon 1er devient-il Empereur des Français?',
            name: 'Q2',
            choices: [
                '1799',
                '1804', /*la bonne*/
                'Wesh 2020 mon frère !',
            ]
        },{
            type: 'list',
            message: '3) En quelle année commence la Guerre de Cent Ans?',
            name: 'Q3',
            choices: [
                '1310',
                '1453',
                'Weeesh 1337 j\'le jure', /*la bonne*/
            ]
        }
        // Correction histoire
        ]).then((answers) => {
            console.log('Question 1: Tu as répondu:')
            console.log(answers.Q1)
            if (answers.Q1 == Q1R){
                console.log('Bien joué ! C\'est elle')
                score = score + 1
            } else {
                console.log('Bah non, c\'est Catherine (pas laborde hein)')
            }
            console.log('Question 2: Tu as répondu:')
            console.log(answers.Q2)
            if (answers.Q2 == Q2R){
                console.log('Bien joué ! Avoue t\'as mis au hasard')
                score = score + 1
            } else {
                console.log('Bah non, c\'est en 1804 *tchiiiiip*')
            }
            console.log('Question 3: Tu as répondu:')
            console.log(answers.Q3)
            if (answers.Q3 == Q3R){
                console.log('izy mon fraire b1 jouai !')
                score = score + 1
            } else {
                console.log('MDR TES UN BOLOSS!')
            }
            //présentation score
            console.log('\r\n Et bien mon ' + login.username + ', voilà ton score : ' + score)
        })
    //If pour theme geek
    } else if (program.geek){
        theme = 'Geek'
        console.log(theme)
        //Reponses pour GEEK
        const Q1R = '4 mars 2000'
        const Q2R = 'Windows 98'
        const Q3R = 'aout 1962'
        // Debut quizz GEEK
        return inquirer.prompt([{
            type: 'list',
            message: '1) Quand est sortie la meilleur console du monde, la PS2 ?',
            name: 'Q1',
            choices: [
                '4 mars 2001',
                '4 mars 2000',
                '1 avril 2000',
            ]
        }, {
            type: 'list',
            message: '2) Sur quelle OS Bill Gates a eu un BSOD lors d\'une présentation au public ?',
            name: 'Q2',
            choices: [
                'Windows 95',
                'Windows Vista',
                'Windows 98',
            ]
        }, {
            type: 'list',
            message: '3) En quelle année Spider Man a fait sa première appararition?',
            name: 'Q3',
            choices: [
                'aout 1973',
                'aout 1974',
                'aout 1962', /*la bonne*/
            ]
        }
        //Retour des corrections
        ]).then((answers) => {
            console.log('Question 1: Tu as répondu:')
            console.log(answers.Q1)
            if (answers.Q1 == Q1R) {
                console.log('Bien joué ! C\'est elle')
                score = score + 1
            } else {
                console.log('Bah non, c\'est 4 mars 2000')
            }
            console.log('Question 2: Tu as répondu:')
            console.log(answers.Q2)
            if (answers.Q2 == Q2R) {
                console.log('Bien joué ! Avoue t\'as mis au hasard')
                score = score + 1
            } else {
                console.log('Bah non, c\'est Windows 98 *tchiiiiip*')
            }
            console.log('Question 3: Tu as répondu:')
            console.log(answers.Q3)
            if (answers.Q3 == Q3R) {
                console.log('izy mon fraire b1 jouai !')
                score = score + 1
            } else {
                console.log('MDR TES UN BOLOSS! Aout 1962 ')
            }
            //présentation score
            console.log('\r\n Et bien mon ' + login.username + ', voilà ton score : ' + score)
        })
    // Retour si aucun theme choisi
    } else {
        console.log('Ah ! Il faut d\'abors lancer un theme ! Donc --histoire ou --geek')
    }
}).then(() => {
    try {
        // Écrire un fichier de score  
        fs.appendFile('Scores.txt', 'Login: ' + usr + ' Thème: ' + theme + ' Score: ' + score + '\r\n', (err) => {
            if (err) throw err
        }) 
        // Lire le fichier de score
        fs.readFile('Scores.txt', 'utf8', (err, data) => {
            if (err) throw err
            console.log('\r\n Vos scores précédents : \r\n\r\n ' + data)
        })
        //Insertion dans BDD du score
        db.run("INSERT INTO game VALUES (?, ?, ?)", [usr, theme, score])
    } catch (err) {
        console.error('ERR > ', err)
    }
})