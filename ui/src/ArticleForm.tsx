import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Article } from "./model";
import useFetch, { put } from "./fetch";

export default function ArticleForm() {
  const navigate = useNavigate();
  const params = useParams();
  const url = `http://localhost:3000/articles/${params.id}`;
  const [article, fetching]: [Article | null, boolean] = useFetch<Article>(url);
  const [message, setMessage] = useState(null);

  if (!article) {
    return (
      <div id="ArticleForm">{fetching ? <p>Fetching article...</p> : null}</div>
    );
  }

  const setTitle = (title: string) => {
    title = title.trim();
    if (title !== article.title) {
      article.title = title;
    }
  };

  const setAuthor = (author: string) => {
    author = author.trim();
    if (author !== article.author) {
      article.author = author;
    }
  };

  const setBody = (body: string) => {
    if (body !== article.body) {
      article.body = body;
    }
  };

  const save = async () => {
    try {
      await put(url, article);
    } catch (e: any) {
      setMessage(e.message);
      return;
    }
    navigate(`/articles/${params.id}`);
  };

  return (
    <div id="ArticleForm">
      {message ? <p>{message}</p> : null}

      <form
        className="col"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <input
          type="text"
          defaultValue={article.title}
          onInput={(event: any) => setTitle(event.target.value)}
        />

        <input
          type="text"
          defaultValue={article.author}
          onInput={(event: any) => setAuthor(event.target.value)}
        />

        <textarea
          defaultValue={article.body}
          onInput={(event: any) => setBody(event.target.value)}
        ></textarea>

        <div className="row">
          <Link to={`/articles/${article.id}`} className="button">
            Cancel
          </Link>
          <button type="submit" className="primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
