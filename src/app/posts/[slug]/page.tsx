"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Style from "./page.module.css";
import Link from "next/link";
import Loader from "@/components/Loader/Loader";

export default function page() {
  const { slug } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async (postId: any) => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch the post details
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      // Fetch comments
      const commentsResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
      setPost(response.data);
      setComments(commentsResponse.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  return (
    <div className={Style.blog}>
      <div className={Style.breadCrumb}>
        <Link href="/">Posts</Link>
        <span>{">"}</span>
        <span>SinglePost</span>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p>Error: {error}</p>
      ) : post ? (
        <>
          <div className={Style.content}>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
          </div>
          <h6 className={Style.commentsTitle}>Comments</h6>

          <div className={Style.comments}>
            {comments.map((comment: any) => {
              return (
                <div key={comment.id} className={Style.comment}>
                  <div className={Style.user}>
                    <p>
                      Name: <span>{comment.name}</span>
                    </p>
                    <p>
                      Email: <span>{comment.email}</span>
                    </p>
                  </div>
                  <p>{comment.body}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>Post not found</p>
      )}
    </div>
  );
}
