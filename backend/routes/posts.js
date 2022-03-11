const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.post("",(req,res,next) => {
    const post = new Post({
        title : req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        //console.log(result);
        res.status(201).json({
            message: "POST ADDED SUCCESSFULLY",
            postId: createdPost._id
        });
    });
    //console.log(post);
    
});

router.put("/:id", (req,res,next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: "Update successful"});
    });
});

router.get('', (req,res,next) => {
    /*const posts = [
        {id: 'fad5123ed', title:'1st post', content:'some content'},
        {id: 'd8dbg74h5', title:'2nd post', content:'some more content'}
    ]*/

    Post.find().then(documents => {
        //console.log(documents);
        res.status(200).json({
            message: 'POSTS FETCHED SUCCESSFULLY',
            posts: documents
        });
    });  
});

router.get('/:id', (req,res,next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "POST NOT FOUND"
            });
        }
    });
});

router.delete('/:id', (req,res,next) => {
    //console.log(req.params.id);
    Post.deleteOne({_id : req.params.id}).then(result => {
        console.log(result);
    });
    res.status(200).json({
        message: "POST DELETED"
    });
});

module.exports = router;