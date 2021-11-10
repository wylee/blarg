import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div id="App">
      <header>
        <h1>
          <a href="/">Blarg</a>
        </h1>
      </header>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/articles">Articles</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
