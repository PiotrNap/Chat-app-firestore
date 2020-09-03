import React, { useState, useEffect } from 'react';
import { firebase, db, setupPresence } from './firebase';
import { Router, Redirect } from '@reach/router';
import Channel from './Channel';

import './App.css';

function App() {
  const user = useAuth();

  return user ? (
    <div className="App">
      <Router>
        <Channel path="channel/:channelId" user={user} />
        <Redirect from="/" to="channel/Random" noThrow />
      </Router>
    </div>
  ) : (
    <div className="main-auth">
      <Login />
    </div>
  );
}

function Login() {
  const [authError, setAuthError] = useState(null);

  const handleFacebookAuth = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="inner-auth">
      <h2>Welcome to Chatey!</h2>
      <button onClick={handleFacebookAuth}>Sign in With Facebook</button>
      <button onClick={handleGoogleAuth}>Sign in With Google</button>
      {authError && <p>{authError}</p>}
    </div>
  );
}

function useAuth() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user = {
          displayName: firebaseUser.displayName,
          photo: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        };
        setAuthUser(user);
        db.collection('users').doc(user.uid).set(user, { merge: true });
        setupPresence(user);
      } else {
        setAuthUser(null);
      }
    });
  }, []);
  return authUser;
}

export default App;
