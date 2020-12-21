const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const Post = require('../../models/posts');

//Endpoint      /post
//Type          GET
//Access        public
//Use           test api
router.get('/test/', (req, res) => {
    res.send('Post api...')
})


//Endpoint      /post/me/all/
//Type          GET
//Access        private
//Use          get all logged in user posts
router.get('/me/all/', authMiddleware, async (req, res) => {
    try {
        const post = await Post.find({
            author: req.user.id
        }).populate('author', ['username', 'avatar']);
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})


//Endpoint      /post/all/
//Type          GET
//Access        public
//Use           get all posts
router.get('/all/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', ['username', 'avatar']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//Endpoint      /post/user/:user_id
//Type          GET
//Access        public
//Use           get all posts of a particular user
router.get('/user/:user_id', async (req, res) => {
    try {
        const posts = await Post.find({
            'author': req.params.user_id
        }).populate('author', ['username', 'avatar']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//Endpoint      /post/create/
//Type          POST
//Access        private
//Use           add a post
router.post('/create/', [authMiddleware, [
    check('heading', 'Heading is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send(400).json({
            errors: errors.array()
        });
    }
    try {
        let {
            heading,
            content
        } = req.body;
        let post = {};
        post.author = req.user.id;
        post.heading = heading;
        post.content = content;
        post = Post(post);
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})


//Endpoint      /post/delete/:post_id
//Type          Delete
//Access        private
//Use           delete a post
router.delete('/delete/:post_id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndRemove(req.params.post_id);
        res.json({
            msg: "Post deleted successfully"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})


//Endpoint      /post/like/:post_id
//Type          Get
//Access        private
//Desc          Like a post
router.get('/like/:post_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (String(post.author) === String(req.user.id)) {
            return res.status(400).json({
                errors: [{
                    msg: "Author can't like/dislike it's own post"
                }]
            });
        }
        const alreadyLiked = post.likes.some(obj => String(obj.user) == String(req.user.id));
        if (alreadyLiked) {
            return res.status(400).json({
                errors: [{
                    msg: "Can't like the same post twice"
                }]
            });
        }
        const dislikedArray = post.dislikes.filter(obj => String(obj.user) != String(req.user.id));
        post.likes.push({
            user: req.user.id
        });
        post.dislikes = dislikedArray;
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//Endpoint      /post/remove/like/:post_id
//Type          Delete
//Access        private
//Desc          Remove like from a post
router.delete('/remove/like/:post_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (String(post.author) === String(req.user.id)) {
            return res.status(400).json({
                errors: [{
                    msg: "Author can't like/dislike it's own post"
                }]
            });
        }
        const alreadyLiked = post.likes.some(obj => String(obj.user) == String(req.user.id));
        if (!alreadyLiked) {
            return res.status(400).json({
                errors: [{
                    msg: "Can't remove a like from a post which is not liked yet"
                }]
            });
        }
        const newLikedArray = post.likes.filter(obj => String(obj.user) != String(req.user.id));
        post.likes = newLikedArray;
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//Endpoint      /post/dislike/:post_id
//Type          Get
//Access        private
//Desc          Dislike a post
router.get('/dislike/:post_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (String(post.author) === String(req.user.id)) {
            return res.status(400).json({
                errors: [{
                    msg: "Author can't like/dislike it's own post"
                }]
            });
        }
        const alreadyDisliked = post.dislikes.some(obj => String(obj.user) == String(req.user.id));
        if (alreadyDisliked) {
            return res.status(400).json({
                errors: [{
                    msg: "Can't dislike the same post twice"
                }]
            });
        }
        const likedArray = post.likes.filter(obj => String(obj.user) != String(req.user.id));
        post.dislikes.push({
            user: req.user.id
        });
        post.likes = likedArray;
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//Endpoint      /post/remove/like/:post_id
//Type          Delete
//Access        private
//Desc          Remove like from a post
router.delete('/remove/dislike/:post_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (String(post.author) === String(req.user.id)) {
            return res.status(400).json({
                errors: [{
                    msg: "Author can't like/dislike it's own post"
                }]
            });
        }
        const alreadyDisliked = post.dislikes.some(obj => String(obj.user) == String(req.user.id));
        if (!alreadyDisliked) {
            return res.status(400).json({
                errors: [{
                    msg: "Can't remove a dislike from a post which is not liked yet"
                }]
            });
        }
        const newDislikedArray = post.dislikes.filter(obj => String(obj.user) != String(req.user.id));
        post.dislikes = newDislikedArray;
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//Endpoint      /comment/:post_id
//Type          Post
//Access        private
//Desc          Comment on a post
router.post('/comment/:post_id', [authMiddleware, [
    check('comment', 'Comment field is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "No such post exist"
                }]
            });
        }
        let comment = {};
        comment.user = req.user.id;
        comment.comment = req.body['comment'];
        post.comments.push(comment);
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                errors: [{
                    msg: 'No such post found'
                }]
            });
        }
        res.status(500).send('Server error');
    }
})


//Endpoint      /delete/comment/:post_id
//Type          Delete
//Access        private
//Desc          Delete Comment on a post
router.delete('/remove/comment/:post_id/:comment_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "No such post exist"
                }]
            });
        }
        const commentsArray = post.comments.filter(obj => String(obj.id) != String(req.params.comment_id));
        post.comments = commentsArray;
        await post.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({
                errors: [{
                    msg: 'No such post found'
                }]
            });
        }
        res.status(500).send('Server error');
    }
})

module.exports = router