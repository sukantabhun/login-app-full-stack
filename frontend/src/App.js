import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import React, { Component } from 'react';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import NotFound from './components/NotFound';

class App extends Component {
  state = { userDetails: null, redirectTo: null ,isLoading: true};

  componentDidMount() {
    let stringified = localStorage.getItem('userDetailsMovie');
    let output = JSON.parse(stringified);
    if (output && output.email) {
      this.setState({ userDetails: output, redirectTo: '/'  ,isLoading:false});
    }
    else{
      this.setState({redirectTo: '/login', isLoading:false});
    }
  }

  onRegisterButton = (data) => {
    console.log('Registered user:', data);
    this.setState({ userDetails: data, redirectTo: '/' });
  }

  onLoginButton = (data) => {
    console.log('Logged in user:', data);
    this.setState({ userDetails: data, redirectTo: '/' });
  }

  render() {
    const { userDetails , redirectTo ,isLoading} = this.state;


    return isLoading?(
      <div className="page">
        <div class="spinner"></div>
      </div>
    ):(
      <div className="page">
        <Routes>
          <Route path="/" element={userDetails ? <Home userDetails={userDetails} /> : <Navigate to={redirectTo} />} />
          <Route path="/login" element={<LoginPage onRegisterButton={this.onRegisterButton} onLoginButton={this.onLoginButton} userDetails={userDetails} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
  }
}

export default App;
