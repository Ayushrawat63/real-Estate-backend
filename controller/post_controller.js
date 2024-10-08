const prisma = require("../lib/prismaClient");
const jwt = require("jsonwebtoken");
const getPosts = async (req, res) => {
  const query = req.query;
  // console.log(query)
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 100000,
        },
      },
    });
    // setTimeout(()=>{
    res.status(200).json(posts);
    // },1000)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch Posts!" });
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true
          },
        },
        savePost:true
      },
    });
    if (!post) return res.status(401).json({ message: "post does not exits" });

    const token = req.cookies?.jwtToken;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECERT_KEY);
      if (payload) {
        const saved = await prisma.savePost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        return res.status(200).json({ ...post, isSaved: saved ? true : false });
      }
    }

    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch Post!" });
  }
};

const addPost = async (req, res) => {
  const userId = req.payload.id;
  const body = req.body;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId,
        postDetail: {
          create: body.postDetails,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add Post!" });
  }
};

const updatePost = async (req, res) => {
  try {
    res.status(200).json("its woking!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update Post!" });
  }
};

const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (post.userId != req.payload.id)
      return res.status(403).json({ message: "Not Autherized" });

    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json("Post Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete Post!" });
  }
};

const deleteAllPost = async (req, res) => {
  try {
    await prisma.post.deleteMany();
    res.status(200).json(" ALL Post Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete Post!" });
  }
};

module.exports = {
  getPost,
  getPosts,
  addPost,
  updatePost,
  deletePost,
  deleteAllPost,
};
