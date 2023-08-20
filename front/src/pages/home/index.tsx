import { Key, useState } from "react";
import supabase from "../../components/supabase";
import {BiExit} from "react-icons/bi"
import "./style.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
interface Color {
    name: string;
    color: string;
}
export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert("There was a problem getting data!");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}
function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }: any) {
  const appTitle = "Today I Learned";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I Learned Logo" />
        <h1>{appTitle}</h1>
       
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show: any) => !show)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
       <Link to="/login" title="logout"><BiExit className="hover:scale-110 duration-150" size={50} /></Link>
    </header>
  );
}
const colorArr: Color[] = [
  { name: "technology", color: "#0ea5e9" },
  { name: "science", color: "#6366f1" },
  { name: "finance", color: "#facc15" },
  { name: "society", color: "#ef4444" },
  { name: "entertainment", color: "#ec4899" },
  { name: "health", color: "#22c55e" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#a855f7" },
];

function isValidHttpUrl(string: string | URL) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }: any) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category, setCategory] = useState("");
  const textLength = text.length;
  const [isUploanding, setIsUploading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // const newFact = {
      //   id: Math.round(Math.random() * 100000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createIn: new Date().getFullYear(),
      // };
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      if (!error) setFacts((facts: any) => [newFact[0], ...facts]);

      setText("");
      setSource("");
      setCategory("");
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        value={text}
        type="text"
        disabled={isUploanding}
        placeholder="Share a fact with the world..."
        onChange={(e) => setText(e.target.value)}
      />

      <span>{200 - textLength}</span>
      <input
        disabled={isUploanding}
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        disabled={isUploanding}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Choose category</option>
        {colorArr?.map((cat: any) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploanding}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }: any) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className=" btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>

        {colorArr?.map((cat: any) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }: any) {
  if (facts.length === 0)
    return (
      <p className="message">
        No facts for this category yet. Creat the firt one!
      </p>
    );
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact: { id: Key | null | undefined; }) => (
          <Fact key={fact.id} setFacts={setFacts} fact={fact} />
        ))}
      </ul>
      <p>There ate {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact, setFacts }: any) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName: string) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts: any[]) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔DISPUTED]</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: colorArr?.find((cat?: Color) => cat?.name === fact.category)?.color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}
