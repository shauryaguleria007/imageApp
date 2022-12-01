import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `JJyNo7aqRACYYkIm1vcKaOwtAEN2t9MngUgma_NRO_4`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const render = useRef(1);
  const aa = useRef(false);
  useEffect(() => {
    if (aa.current) render.current += 1;
    aa.current = true;
  });
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [querry, setQuerry] = useState("");
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(false);
  console.log(
    "app render ",
    render.current,
    loading,
    photos,
    "page",
    page,
    "newItem",
    newImages,
    querry
  );
  const fetchImages = async () => {
    console.log("fetch start", render.current);
    setLoading(true);
    let url;
    if (!querry) url = `${mainUrl}?client_id=${clientID}&page=${page}`;
    else
      url = `${searchUrl}?client_id=${clientID}&page=${page}&query=${querry}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((old) => {
        if (querry && page === 1) return data.results;
        else if (querry) return [...photos, ...data.results];
        else return [...photos, ...data];
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);
      setLoading(false);
    }
    console.log(`fetch end ${render.current} `);
  };
  useEffect(() => {
    console.log("us1");

    fetchImages();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    console.log("us2");

    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
    // eslint-disable-next-line
  }, [newImages]);
  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    console.log("us3");
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
  }, []);
  const handelSubmit = (e) => {
    e.preventDefault();
    if (!querry) return;
    fetchImages();
    setPage(1);
  };
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={querry}
            onChange={(e) => setQuerry(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handelSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={index} {...photo} />;
          })}
        </div>
        {loading && <h2>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
