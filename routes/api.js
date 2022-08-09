/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  require('dotenv').config();
  let mongoose= require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  const bookIsh= new mongoose.Schema({
    title: {type: String, required: true},
    commentcount: {type: Number, default: 0},
    comments: [String]
  });

  let Book = mongoose.model("Book", bookIsh);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, {__v:0},(err,data)=>{
        if (err) return console.log(err);
        res.json(data);
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) return res.send("missing required field title");
      let form = new Book({
        title: title
      });
      form.save((err,doc)=>{
        if (err) return console.log(err);
        return res.json({title: doc.title, _id: doc.id});
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.remove({}, (err,data)=>{
        if (err) return console.log(err);
        return res.send("complete delete successful");
      })

    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findOne({_id:bookid}, (err,data)=>{
        if (err) return console.log(err);
        if(!data) return res.send("no book exists");
        if(data){
          return res.json(data);
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      Book.findOne({_id: bookid}, (err,data)=>{
        if (err) return console.log(err);
        if(!comment||!bookid) return res.send("missing required field comment");
        if(!data) return res.send("no book exists");
        if(data){
          data.comments.push(comment);
          data.commentcount ++;
          data.save((err, doc)=>{
            if (err) return console.log(err);
            return res.json(doc);
          })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, (err, data)=>{
        if(!data||err){ 
          console.log("could not delete");
          return res.send("no book exists");
      }
        if(data){
          console.log("deleted")
          return res.send("delete successful");
        }
      })


    });
  
};
