import React from "react";
import ArticleList from "./ArticleList";

export default function Home() {
  return (
    <div id="Home">
      Welcome to my blarg.
      <h2>Latest Articles</h2>
      <ArticleList count={1} />
    </div>
  );
}
