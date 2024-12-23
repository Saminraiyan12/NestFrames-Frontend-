import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../../styles/albums.css";
import { UserContext } from "../../UserContext";
function AlbumBody() {
  useEffect(() => {
    document.body.className = "body-default";
  }, []);
  const [album, setAlbum] = useState(null);
  const [nameChange, setNameChange] = useState({
    active: false,
    newName: "",
  });
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const location = useLocation();
  const albumId = location.pathname.split("/")[2];
  const inputRef = useRef(null);
  const getAlbum = async () => {
    const res = await fetch(`http://localhost:3002/albums/${albumId}`);
    if (res) {
      const album = await res.json();
      console.log(album);
      setAlbum(album);
      setAlbumName(album.name);
      setLoading(false);
    } else {
      setNotFound(true);
    }
  };
  const checkAccess = () => {
    if (album) {
      if (album.users.find((u) => u.username === user.username)) {
        setIsCollaborator(true);
      }
    }
  };
  useEffect(() => {
    getAlbum();
    checkAccess();
  }, [albumId]);
  const toggleNameChange = () => {
    setNameChange((prev) => ({ ...prev, active: !prev.active }));
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  const changeName = async () => {
    if (nameChange.newName.trim() === "") {
      alert("Album name cannot be empty.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3002/albums/${albumId}/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameChange.newName }),
      });

      if (res.ok) {
        const updatedAlbum = await res.json();
        console.log(updatedAlbum);
        setAlbumName(updatedAlbum.name);
        setNameChange({ active: false, newName: "" });
      } else {
        console.error("Failed to update the album name.");
        alert("There was an error updating the album name. Please try again.");
      }
    } catch (error) {
      console.error("Error updating the album name:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return album ? (
    <div className="album-page-container">
      <div className="album-head">
        <div className="album-head-left">
          <div className="album-main-header">
            <h1 id="albumName">
              {nameChange.active ? (
                <div className="album-name-change">
                  <input
                    ref={inputRef}
                    placeholder="Enter new name"
                    className="album-name-input"
                    onChange={(e) =>
                      setNameChange((prev) => ({
                        ...prev,
                        newName: e.target.value,
                      }))
                    }
                    value={nameChange.newName}
                  ></input>
                  <i
                    onClick={toggleNameChange}
                    className="fa-solid fa-circle-xmark album-name-xmark"
                  ></i>
                  <i
                    onClick={changeName}
                    className="fa-solid fa-circle-check album-name-check"
                  ></i>
                </div>
              ) : (
                <>
                  {albumName}{" "}
                  <i
                    onClick={toggleNameChange}
                    className="fa-solid fa-edit edit-album-name"
                  ></i>
                </>
              )}
            </h1>
            <div className="album-interactions">
              <div className="album-interaction-icons">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="album-interaction-icons">
                <i className="fa-solid fa-plus"></i>
              </div>
              <div className="album-interaction-icons">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>

              <div className="album-interaction-icons">
                <i className="fa-solid fa-arrow-up-from-bracket"></i>
              </div>
            </div>
          </div>
          <div className="album-cover-photo">
            <img src={album.coverPhoto.fileUrl}></img>
          </div>
        </div>
        <div className="album-collaborator-container">
          <h2>Collaborators</h2>
          <div className="album-collaborators-body">
            <div className="album-collaborators">
              {album.users.map((user, index) => {
                return (
                  <div key={index} className="album-collaborator">
                    <img
                      className="album-collaborator-image"
                      src={user.profilePic.fileUrl}
                    ></img>
                    <div>
                      <h3 className="album-collaborator-name">
                        {user.fullname}
                      </h3>
                      <p className="album-collaborator-username">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                );
              })}
              {album.users.length < 6 ? (
                <div className="album-collaborator">
                  <i className="fa-solid fa-circle-plus"></i>
                  <h3 className="album-collaborator-name"> Add collaborator</h3>
                </div>
              ) : (
                ""
              )}
            </div>

            {album.users.length > 7 ? (
              <button className="album-view-collaborators">View all</button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <hr className="album-body-divider"></hr>
      <div className="album-photos-container">
        {album.photos.map((photo, index) => {
          return <img key={index} src={photo.fileUrl}></img>;
        })}
      </div>
    </div>
  ) : (
    ""
  );
}

export default AlbumBody;
