const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;

        }
        cb(error, "images/");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer({storage: storage}).single("image"), (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title : req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename 
    });
    post.save().then(createdPost => {
        //console.log(result);
        res.status(201).json({
            message: "POST ADDED SUCCESSFULLY",
            post: {
                ///...createdPost,
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });
    //console.log(post);
    
});

router.put("/:id", multer({storage: storage}).single("image"), (req,res,next) => {
    //console.log(req.file);
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host"); 
        imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
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

    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery.then(documents => {
        //console.log(documents);
        fetchedPosts = documents;
        return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'POSTS FETCHED SUCCESSFULLY',
                posts: fetchedPosts,
                maxPosts: count
        })
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