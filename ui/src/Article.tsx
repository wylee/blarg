import React from "react";
import { Link, useParams } from "react-router-dom";
import { Article } from "./model";
import useFetch from "./fetch";
import { formatDateTime } from "./util";

export default function Article() {
  const params = useParams();
  const url = `http://localhost:3000/articles/${params.id}`;
  const [article, fetching]: [Article | null, boolean] = useFetch<Article>(url);

  if (!article) {
    return (
      <div id="Article">{fetching ? <p>Fetching article...</p> : null}</div>
    );
  }

  return (
    <div id="Article" className="col">
      <h2>{article.title}</h2>

      <i>by {article.author}</i>

      <div className="small">Created {formatDateTime(article.created_at)}</div>

      <hr />

      <div>{article.body}</div>

      <hr />

      <div className="row">
        <Link to={`/articles/${article.id}/edit`} className="button primary">
          Edit
        </Link>
      </div>
    </div>
  );
}
