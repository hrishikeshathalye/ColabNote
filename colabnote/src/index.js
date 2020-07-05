import React from "react"
import ReactDOM from "react-dom"
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import App from './components/App/App';
import Home from './components/Home/Home';
ReactDOM.render(
    <Router>
        <App>
            <Switch>
                <Route path="/" component={Home}/>
            </Switch>
        </App>
    </Router>,
    document.querySelector("#root"),
    ()=>{
        console.log("Rendered");
    }
)