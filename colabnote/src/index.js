import React from "react"
import ReactDOM from "react-dom"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import GroupEditor from "./components/Editors/GroupEditor" 
import App from './components/App/App';
import NotFound from './components/App/NotFound';
import Home from './components/Home/Home';
ReactDOM.render(
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={Home}/>
                {/* <Route exact path="/" exact render={()=>{
                    return <Redirect to={`/group/${Date.now()}`} />
                }}/> */}
                {/* <Route exact path="/group/:id" component={GroupEditor}/> */}
                <Route component={NotFound}/>
            </Switch>
        </App>
    </Router>,
    document.querySelector("#root"),
    ()=>{
        console.log("Rendered");
    }
)