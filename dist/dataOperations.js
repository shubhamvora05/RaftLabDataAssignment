
const csv = require('csv-parser');
const fs = require('fs');
var stringify = require('csv-stringify');

var booksPath = '../data/books.csv';
var AuthorPath = '../data/authors.csv';
var magazinesPath = '../data/magazines.csv';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!  Q1. Read CSV DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// __________________   read and format author data __________________________

function readAuthors(csvfilepath, cb) {
  let AuthorData=[];
 
  fs.createReadStream(csvfilepath)
  .pipe(csv())
  .on('data', function(csvrow) {
     
    var rowObject = {
      email:Object.values(csvrow)[0].split(';')[0],
      firstname:Object.values(csvrow)[0].split(';')[1],
      lastname:Object.values(csvrow)[0].split(';')[2]
    }
    
    AuthorData.push(rowObject);

  })
    .on('end', () => {
      cb(AuthorData); 
    });
}


   
// ____________________  read and format magazines data ____________________


 function readMagazines(MagazineFile,cb){
    var MagazineData=[];
    fs.createReadStream(MagazineFile)
    .pipe(csv())
    .on('data', function(csvrow) {

     var author = [];
     var date  = "";

     author.push(Object.values(csvrow)[0].split(';')[2]);
     date=Object.values(csvrow)[0].split(';')[3];

     if(Object.values(csvrow)[1]){
     author.push(Object.values(csvrow)[1].split(';')[0]);
     date=Object.values(csvrow)[1].split(';')[1];
    }
     
      var rowObject = {
        title:Object.values(csvrow)[0].split(';')[0],
        isbn:Object.values(csvrow)[0].split(';')[1],
        authors:author,
        publishedAt:date
      }
      MagazineData.push(rowObject);

    })
    .on('end',function() {
      cb(MagazineData); 
    });
  }


    // ____________________  read and format books data _____________________ 

   function readBook(bookFile,cb){
    var bookData = []
    fs.createReadStream(bookFile)
    .pipe(csv())
    .on('data', function(csvrow) {

      var desc = Object.values(csvrow)[0].split(';')[3];
      var i=1;
      while(true){
      if(Object.values(csvrow)[i]){
        desc+=Object.values(csvrow)[i];
       }else{
         break;
       }
       i++;
      }

      var rowObject = {
        title:Object.values(csvrow)[0].split(';')[0],
        isbn:Object.values(csvrow)[0].split(';')[1],
        authors:Object.values(csvrow)[0].split(';')[2],
       description:desc
      }
      bookData.push(rowObject);
    })
    .on('end',function() {
   cb(bookData);
    });
  }

  
  
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!1 Q2.  print the all data !!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
  readAuthors(AuthorPath, (results) => {
    console.table(results);
  });

  readMagazines(magazinesPath, (results) => {
    console.table(results);
  });

  readBook(booksPath, (results) => {
    console.table(results);
  });

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!   Q3. find books and magazine by ISBN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function findBooksORMAgazineByISBN(ISBN){
  
  readMagazines(magazinesPath, (results) => {
    
    for(let i=0;i<results.length;i++){
      if(results[i].isbn == ISBN){
        console.log("The magazine with "+ISBN+" found.");
        console.log("Title:- "+results[i].title);
        console.log("isbn:- "+results[i].isbn);
        console.log("authors:- "+results[i].authors);
        console.log("publishe date:- "+results[i].publishedAt);
        console.log(" ");
      } 
    }
  });

  readBook(booksPath, (results) => {
    for(let i=0;i<results.length;i++){
      if(results[i].isbn == ISBN){
        console.log("The book with "+ISBN+" found.");
          console.log("Title:- "+results[i].title);
          console.log("isbn:- "+results[i].isbn);
          console.log("authors:- "+results[i].authors);
          console.log("description:- "+results[i].description);
          console.log(" ");
      } 
    }
  });
}

findBooksORMAgazineByISBN("5454-5587-3210");
  

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!   Q4. find books and magazine by authors email !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function findBooksORMAgazineByEmail(Email){
  
  readMagazines(magazinesPath, (results) => {
    
    for(let i=0;i<results.length;i++){
      if(results[i].authors[0] == Email || results[i].authors[1] == Email){
        console.log("The magazine with author "+Email+" found.");
        console.log("Title:- "+results[i].title);
        console.log("isbn:- "+results[i].isbn);
        console.log("authors:- "+results[i].authors);
        console.log("publishe date:- "+results[i].publishedAt);
        console.log(" ");
      } 
    }
  });

  readBook(booksPath, (results) => {
    for(let i=0;i<results.length;i++){
      if(results[i].authors == Email){
        console.log("The book with author "+Email+" found.");
          console.log("Title:- "+results[i].title);
          console.log("isbn:- "+results[i].isbn);
          console.log("authors:- "+results[i].authors);
          console.log("description:- "+results[i].description);
          console.log(" ");
      } 
    }
  });
}

findBooksORMAgazineByEmail("null-walter@echocat.org");


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!   Q5. sort books and magazine by title !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function dynamicSort(property) {
  return function (a,b) {
          return a[property].localeCompare(b[property]);      
  }
}

function sortByTitle(){
  var bookAndMagazines = [];

  readMagazines(magazinesPath, (results) => {
    bookAndMagazines.push.apply(bookAndMagazines, results);
    readBook(booksPath, (results) => {
      bookAndMagazines.push.apply(bookAndMagazines, results);
      bookAndMagazines.sort(dynamicSort("title"));
      console.table(bookAndMagazines);
    });
  });

}

sortByTitle();

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!   Q6. create and append books and magazine data to csv !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const objectToCsv = function (data) {

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(';'));

  for (const row of data) {
      const values = headers.map(header => {
          const val = row[header]
          return `"${val}"`;
      });

      csvRows.push(values.join(';'));
  }

  return csvRows.join('\n');
};

function addDataToCSV(){

  // adding magazine data to csv
  readMagazines(magazinesPath, (results) => {
    let writer = fs.createWriteStream('MagazineTOCsv.csv');
    const csvData = objectToCsv(results);
    writer.write(csvData);
  });

  //adding books data to csv
  readBook(booksPath, (results) => {
    let writer = fs.createWriteStream('BookTOCsv.csv');
    const csvData = objectToCsv(results);
    writer.write(csvData);
  });
}


addDataToCSV();