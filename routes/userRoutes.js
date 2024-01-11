const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { rawListeners } = require('../models/user')

router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = router


//   {
//     userId,
//     commentBody,
//     postId
//   }

//   {
//     body: String
//     userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
//   }

//   {
//     title: String,
//     body: String,
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
//   }
  
  
//   const commentOnPost = async (req, res) => {
//       try {
//           const user = await User.findOne({ '_id': req.body.userId})
//           if(!user) throw new Error('No user found with the given id do you think they were deleted?')
//           const foundPost = await Post.findOne({'_id': req.body.postId})
//           if(!foundPost) throw new Error('User was valid but there was no post found, was the post deleted?')
//           const comment = new Comment({ body: req.body.commentBody, userId: user._id })
//           foundPost.comments.push(comment._id)
//           await comment.save()
//           await foundPost.save()
//           res.status('201').json(comment)
  
//       } catch (error) {
//           res.status('400').json({ msg: 'Could not add comment to database', details: error.message})
//       }
//   }