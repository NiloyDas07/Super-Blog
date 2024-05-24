import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  buckets;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.buckets = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // slug is the document id in this case.
  // userId not needed since we will only give access to the author of the post.
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );

      return true;
    } catch (error) {
      console.log("Error in Appwrite Service :: deletePost ", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Error in Appwrite Service :: getPost ", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Error in Appwrite Service :: getPosts ", error);
      return false;
    }
  }

  // File Upload Services

  async uploadFile(file) {
    try {
      return await this.buckets.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Error in Appwrite Service :: uploadFile ", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.buckets.deleteFile(fileId);
    } catch (error) {
      console.log("Error in Appwrite Service :: deleteFile ", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      return this.buckets.getFilePreview(
        conf.appwriteBucketId,
        fileId);
    } catch (error) {
      console.log("Error in Appwrite Service :: getFilePreview ", error);
      return false;
    }
  }
}

const service = new Service();

export default service;
