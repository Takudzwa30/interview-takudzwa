"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Style from "./page.module.css";
import Link from "next/link";
import Loader from "@/components/Loader/Loader";

export default function Page() {
  return <PageContent />;
}

function PageContent() {
  // State for managing posts data
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Fetch Posts
  const fetchPosts = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // GET posts
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
        {
          params: {
            _page: page,
            _limit: 10, // Number of posts per page
          },
        }
      );

      // Calculate total pages
      const totalPosts = parseInt(response.headers["x-total-count"] || "0", 10);
      setTotalPages(Math.ceil(totalPosts / 10));

      // Update state with the fetched data
      setPosts(response.data);
    } catch (err) {
      // Handle errors and update the state
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts whenever the current page changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  return (
    <div className={Style.blogs}>
      <h1>Blogs</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className={Style.posts}>
            {posts.map((post: any) => (
              <Link
                href={`/posts/${post.id}`}
                className={Style.singleBlog}
                key={post.id}
              >
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <hr />
              </Link>
            ))}
          </div>
          <div className={Style.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              {" "}
              Page {currentPage} of {totalPages}{" "}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
