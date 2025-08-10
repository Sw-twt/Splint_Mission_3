const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 등록 API
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: parseInt(price), tags },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 목록 조회 API
exports.getProducts = async (req, res, next) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: parseInt(limit),
      select: { id: true, name: true, price: true, createdAt: true },
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// 상품 상세 조회 API
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 수정 API
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price: price ? parseInt(price) : undefined, tags },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// 상품 삭제 API
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 이미지 업로드 API
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image not provided' });
  }
  // In a real app, you might want to save the path to the database
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
};
