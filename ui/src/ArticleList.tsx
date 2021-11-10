import React from "react";
import useFetch from "./fetch";
import { Article } from "./model";

function ArticleList() {
  const articles: Article[] | null = useFetch<Article>("http://localhost:3000/articles");

  return (
    <div id="ArticleList">
      <h2>Articles</h2>
      {articles ? (
        <ul>
          {articles.map((a: Article) => (
            <li key={a.id}>{a.title}</li>
          ))}
        </ul>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}

export default ArticleList;
