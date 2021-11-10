import React from "react";
import { Link } from "react-router-dom";
import useFetch from "./fetch";
import { Article } from "./model";
import { formatDateTime } from "./util";

export default function ArticleList({ count = 0 }) {
  const [articles, fetching]: [Article[] | null, boolean] = useFetch<Article[]>(
    "http://localhost:3000/articles"
  );

  return (
    <div id="ArticleList">
      {articles ? (
        <ul>
          {articles.slice(0, count || undefined).map((a: Article) => (
            <li key={a.id} className="list-article">
              <p>
                <Link to={`/articles/${a.id}`}>{a.title}</Link>{" "}
                <i>by {a.author}</i>
              </p>
              <p className="small">Created {formatDateTime(a.created_at)}</p>
            </li>
          ))}
        </ul>
      ) : fetching ? (
        <p>Fetching articles...</p>
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}
