const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 등록 API
exports.createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

// 게시글 목록 조회 API
exports.getArticles = async (req, res, next) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: offset,
      take: parseInt(limit),
      select: { id: true, title: true, content: true, createdAt: true },
    });

    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회 API
exports.getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// 게시글 수정 API
exports.updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제 API
exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
