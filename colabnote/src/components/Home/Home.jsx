import React, { Component } from 'react';
import 'whatwg-fetch';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import GroupEditor from '../Editors/GroupEditor' 
import {
    getFromStorage,
    setInStorage
} from '../../utils/storage'
import Editor from '../Editors/Editor';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signInError:'',
      signInEmail:'',
      signInPassword:'',
      signUpFirstName:'',
      signUpLastName:'',
      signUpPassword:'',
      signUpEmail:'',
      signUpError:''
    };
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('ColabNote')
    if(obj && obj.token){
        const {token} = obj;
        fetch('/api/account/verify?token=' + token).then(res=>res.json())
        .then(json=>{
            if(json.success){
                this.setState({
                    token,
                    isLoading:false
                })
            }
            else{
                this.setState({
                    isLoading:false
                })
            }
        })
    }else{
        this.setState({
            isLoading:false
        })
    }
  }
  
  onTextboxChangeSignInEmail(event){
    this.setState({
        signInEmail:event.target.value
    })
  }

  onTextboxChangeSignInPassword(event){
    this.setState({
        signInPassword:event.target.value
    })
  }

  onTextboxChangeSignUpEmail(event){
    this.setState({
        signUpEmail:event.target.value
    })
  }

  onTextboxChangeSignUpPassword(event){
    this.setState({
        signUpPassword:event.target.value
    })
  }

  onTextboxChangeSignUpFirstName(event){
    this.setState({
        signUpFirstName:event.target.value
    })
  }

  onTextboxChangeSignUpLastName(event){
    this.setState({
        signUpLastName:event.target.value
    })
  }

  onSignUp(){
    const {
        signUpFirstName,
        signUpLastName,
        signUpEmail,
        signUpPassword
    } = this.state;
    this.setState({
        isLoading:true
    });
    fetch('/api/account/signup',
     { method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            firstname : signUpFirstName,
            lastname : signUpLastName,
            password : signUpPassword,
            email: signUpEmail
        })
    }).then(res => res.json())
      .then(json => {
        if(json.success){
            this.setState({
                signUpError:json.message,
                isLoading:false,
                signUpEmail:'',
                signUpPassword:'',
                signUpFirstName:'',
                signUpLastName:''
            })
        }
        else{
            this.setState({
                signUpError:json.message,
                isLoading:false
            })
        }
    });
  }

  onSignIn(){
    const {
        signInEmail,
        signInPassword
    } = this.state;
    this.setState({
        isLoading:true
    });
    fetch('/api/account/signin',
     { method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            password : signInPassword,
            email: signInEmail
        })
    }).then(res => res.json())
      .then(json => {
        if(json.success){
            setInStorage('ColabNote',{token:json.token});
            this.setState({
                signInError:json.message,
                isLoading:false,
                signInEmail:'',
                signInPassword:'',
                token:json.token
            })
        }
        else{
            this.setState({
                signInError:json.message,
                isLoading:false
            })
        }
    });
  }

  logout(){
    this.setState({
        isLoading:true
    });
    const obj = getFromStorage('ColabNote')
    if(obj && obj.token){
        const {token} = obj;
        fetch('/api/account/logout?token=' + token).then(res=>res.json())
        .then(json=>{
            if(json.success){
                this.setState({
                    token:'',
                    isLoading:false
                })
            }
            else{
                this.setState({
                    isLoading:false
                })
            }
        })
    }else{
        this.setState({
            isLoading:false
        })
    }
  }

  render() {
    const {
        isLoading,
        token,
        signInError,
        signInEmail,
        signInPassword,
        signUpFirstName,
        signUpLastName,
        signUpPassword,
        signUpEmail,
        signUpError
    } = this.state;
    if(isLoading){
        return <div id="loading"><h1>Loading...</h1></div>
    }
    if(!token){
        return(<div style={{marginTop:'2rem'}}>
        <div id="signInComponent">
        {
            (signInError) ? (
                <p>{signInError}</p>
            ): (null)
        }
        <form>
            <h4>Sign In</h4>
            <div className={"form-group"}>
                <label htmlFor="signinemail">Email</label><br />
                <input id="signinemail" type="email" placeholder="Email" value={signInEmail} onChange={this.onTextboxChangeSignInEmail}/><br />
            </div>
            <div className={"form-group"}>
                <label htmlFor="signinpassword">Password</label><br />
                <input id="signinpassword" type="password" placeholder="Password" value={signInPassword} onChange={this.onTextboxChangeSignInPassword}/>
            </div>
            <button type="submit" className={'btn btn-primary'} onClick={this.onSignIn}>Sign In</button>
        </form>
        </div>
        <div id="signUpComponent" >
        {
            (signUpError) ? (
                <p>{signUpError}</p>
            ): (null)
        }
        <form>
            <h4>Sign Up</h4>
            <div className={"form-group"}>
                <label htmlFor="signupfirstname">First Name</label><br />
                <input id="signupfirstname" type="text" placeholder="First Name" value={signUpFirstName} onChange={this.onTextboxChangeSignUpFirstName}/>
            </div>
            <div className={"form-group"}>
                <label htmlFor="signuplastname">Last Name</label><br />
                <input id="signuplastname" type="text" placeholder="Last Name" value={signUpLastName} onChange={this.onTextboxChangeSignUpLastName}/>
            </div>
            <div className={"form-group"}>
                <label htmlFor="signupemail">Email</label><br />
                <input id="signupemail" type="email" placeholder="Email" value={signUpEmail} onChange={this.onTextboxChangeSignUpEmail}/>
            </div>
            <div className={"form-group"}>
                <label htmlFor="signuppassword">Password</label><br />
                <input id="signuppassword" type="password" placeholder="Password" value={signUpPassword} onChange={this.onTextboxChangeSignUpPassword}/>
            </div>
            <button type="submit" className={"btn btn-primary"} onClick={this.onSignUp}>Sign Up</button>
        </form>
        </div>
        </div>
        )}
    return (
      <div>
        <nav className="navbar navbar-expand-lg">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav nav-fill w-100">
                    <a className="nav-item nav-link btn-primary btn active" style={{marginRight:'5px'}} href="/try">Try<span class="sr-only">(current)</span></a>    
                    <a className="nav-item btn nav-link btn-primary" style={{marginRight:'5px'}} href="/">My Notes</a>
                    <a className="nav-item nav-link btn-primary btn" style={{marginRight:'5px'}} href="/">Shared With Me</a>
                    <a className="nav-item btn btn-primary" onClick={this.logout}>Logout</a>
                </div>
            </div>
        </nav>
        <BrowserRouter>
            <Route
                path="/"
                exact
                render={() => {
                return <Redirect to={`/group/try`} />;
                }}
            />
            <Route path="/group/:id" component={GroupEditor} />
        </BrowserRouter>
      </div>
    );
  }
}

export default Home;