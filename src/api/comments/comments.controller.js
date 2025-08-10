const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품에 댓글 등록
exports.createProductComment = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: { content, productId: parseInt(productId) },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// 게시글에 댓글 등록
exports.createArticleComment = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: { content, articleId: parseInt(articleId) },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// 상품 댓글 목록 조회 (Cursor-based Pagination)
exports.getProductComments = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      take: parseInt(limit),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// 게시글 댓글 목록 조회 (Cursor-based Pagination)
exports.getArticleComments = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      take: parseInt(limit),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// 댓글 수정
exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
