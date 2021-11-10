import React from "react";
import { useParams } from "react-router-dom";
import { Article } from "./model";
import useFetch from "./fetch";
import {formatDateTime} from "./util";

export default function Article() {
  const params = useParams();
  const id = params.id;
  const [article, fetching]: [Article | null, boolean] = useFetch<Article>(
    `http://localhost:3000/articles/${id}`
  );

  if (!article) {
    return null;
  }

  return (
    <div id="Article">
      {fetching ? (
        <p>Fetching article...</p>
      ) : (
        <>
          <h2>{article.title}</h2>
          <p><i>by {article.author}</i></p>
          <p className="small">
            Created {formatDateTime(article.created_at)}
          </p>
          <hr/>
          <p>{article.body}</p>
        </>
      )}
    </div>
  );
}
