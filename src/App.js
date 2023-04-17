import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  collectionGroup,
  query,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
  endBefore 
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  console.log('auth', auth?.currentUser?.email)
  const [movieList, setMovieList] = useState([]);

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  const [page, setPage] = useState(1);

  const moviesCollectionRef = collection(db, "movies");

  const PAGE_SIZE = 3;
  const [lastVisible, setLastVisible] = useState(0);
  const [firstVisible, setFirstVisible] = useState(0);

  const getMovieList = async () => {
    const q = query(
      collectionGroup(db, "movies"),
      orderBy("newMovieTitle", "asc"),
      limit(PAGE_SIZE)
    );
    onSnapshot(q, (documents) => {
      const tempPosts = [];
      documents.forEach((document) => {
        tempPosts.push({
          id: document.id,
          ...document.data(),
        });
      });
      setMovieList(tempPosts);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
    });
  };

  useEffect(() => {
    getMovieList();
  }, []);
  // console.log('auth?.currentUser?.uid', auth?.currentUser?.uid)
  // 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
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        newMovieTitle: newMovieTitle,
        newReleaseDate: newReleaseDate,
        isNewMovieOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      // getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const nextPage = async () => {
    const postsRef = collectionGroup(db, "movies");
    const q = query(
      postsRef,
      orderBy("newMovieTitle", "asc"),
      startAfter(lastVisible),
      limit(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    // console.log('documents', documents)
    onSnapshot(q, (documents) => {
      const tempPosts = [];
      documents.forEach((document) => {
        tempPosts.push({
          id: document.id,
          ...document.data(),
        });
      });
      setMovieList(tempPosts);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
    });
    // setMovieList(documents);
  };

  const previousPage = async () => {
    // console.log('pre firstVisible', firstVisible)
    const postsRef = collectionGroup(db, "movies");
    const q = query(
      postsRef,
      orderBy("newMovieTitle", "asc"),
      endBefore(firstVisible),
      limit(PAGE_SIZE)
    );
    const documents = await getDocs(q);
    onSnapshot(q, (documents) => {
      const tempPosts = [];
      documents.forEach((document) => {
        tempPosts.push({
          id: document.id,
          ...document.data(),
        });
      });
      setMovieList(tempPosts);
      setLastVisible(documents.docs[documents.docs.length - 1]);
      setFirstVisible(documents.docs[0]);
    });
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    // getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { newMovieTitle: updatedTitle });
    // getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth auth={auth} />

      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label> Received an Oscar</label>
        <button onClick={onSubmitMovie}> Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie, key) => (
          <div key={key}>
            <h1 style={{ color: movie.isNewMovieOscar ? "green" : "red" }}>
              {movie.newMovieTitle}
            </h1>
            <p> Date: {movie.newReleaseDate} </p>

            {/* <button onClick={() => deleteMovie(movie.id)}> Delete Movie</button>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              {" "}
              Update Title
            </button> */}
          </div>
        ))}
        <button onClick={() => previousPage()}> Previous</button>
        <button onClick={() => nextPage()}> Next</button>
      </div>

      {/* <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}> Upload File </button>
      </div> */}
    </div>
  );
}

export default App;
