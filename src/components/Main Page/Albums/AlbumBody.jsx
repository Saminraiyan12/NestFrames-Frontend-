import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../styles/albums.css";
import AlbumHeader from "./AlbumHeader";
import AlbumPhotos from "./AlbumPhotos";
function AlbumBody() {
  useEffect(()=>{
    document.body.className = 'body-default';
  },[]);
  const [album, setAlbum] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();
  const albumId = location.pathname.split("/")[2];
  const fetchAlbum = async () => {
    try {
      const res = await fetch(`http://localhost:3002/albums/${albumId}`);
      if (res.ok) {
        const albumData = await res.json();
        setAlbum(albumData);
        setAlbumName(albumData.name);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  if (loading) return <p>Loading...</p>;
  if (notFound) return <p>Album not found.</p>;

  return (
    <div className="album-page-container">
      <AlbumHeader
        setAlbum={setAlbum}
        albumName={albumName}
        setAlbumName={setAlbumName}
        albumId={albumId}
        album={album}
      />
      <hr className="album-body-divider" />
      <AlbumPhotos album={album} />
    </div>
  );
}

export default AlbumBody;