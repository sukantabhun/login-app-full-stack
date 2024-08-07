import './index.css';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginForm: true,
      email: '',
      password: '',
      name: '',
      redirect: null,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const { onLoginButton } = this.props;
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        console.log('Login successful:', data);
        this.setState({ redirect: '/' });
        onLoginButton({ name: data.name, email, password });
      } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        this.setState({ error: errorText });
      }
    } catch (error) {
      console.error('Error logging in:', error.message || error);
      this.setState({ error: 'An unexpected error occurred.' });
    }
  };
  

  handleRegister = async (event) => {
    event.preventDefault();
    const { email, password, name } = this.state;
    const { onRegisterButton } = this.props;

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status === 200) {
        console.log('Registration successful');
        this.setState({ redirect: '/' });
        localStorage.setItem('userDetailsMovie', JSON.stringify({ name, email, password }));
        onRegisterButton({ name, email, password });
      } else {
        console.error('Registration failed:', await response.text());
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  render() {
    const { isLoginForm, email, password, name, redirect } = this.state;

    if (redirect) {
      return <Navigate to={redirect} />;
    }

    return (
      <div className='elements-container'>
        <img
          src="https://imgs.search.brave.com/PBObDQhElLLghbtGfzIbbeZ_G5wGbf2rCuVZ7CMUum4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aGFzaG5vZGUuY29t/L3Jlcy9oYXNobm9k/ZS9pbWFnZS91cGxv/YWQvdjE2NDc0OTA2/MTk5NjUvUDFkc05n/ai1mMS5wbmc"
          alt="react"
          className="img-style"
        />
        {isLoginForm ? (
          <form onSubmit={this.handleLogin} className="form">
            <h2 className='login-header'>Login</h2>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              className='input'
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              className='input'
            />
            <button type="submit" className="button">Login</button>
            <p>Don't have an account? <button type="button" className="txt-decoration" onClick={() => this.setState({ isLoginForm: false })} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>Register</button></p>
          </form>
        ) : (
          <form onSubmit={this.handleRegister} className="form">
            <h2 className='login-header'>Register</h2>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              className='input'
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              className='input'
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              className='input'
            />
            <button type="submit" className='button'>Register</button>
            <p>Already have an account? <button type="button" className="text-btn" onClick={() => this.setState({ isLoginForm: true })} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>Login</button></p>
          </form>
        )}
      </div>
    );
  }
}

export default LoginPage;
