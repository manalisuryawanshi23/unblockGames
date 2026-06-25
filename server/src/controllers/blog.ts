import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { submitToIndexNow } from '../lib/indexnow';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      include: { category: true }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true }
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const post = await prisma.blogPost.create({ data });
    
    if (post.isPublished) {
      await submitToIndexNow(`https://www.unblockedgameszone.com/blog/${post.slug}`);
    }
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const post = await prisma.blogPost.update({ where: { id }, data });
    
    if (post.isPublished) {
      await submitToIndexNow(`https://www.unblockedgameszone.com/blog/${post.slug}`);
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.delete({ where: { id } });
    
    if (post && post.isPublished) {
      await submitToIndexNow(`https://www.unblockedgameszone.com/blog/${post.slug}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
