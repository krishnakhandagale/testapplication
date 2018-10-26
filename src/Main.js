import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from "./Home";
import SearchArticle from "./SearchArticle";

class Main extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/searchArticle' component={SearchArticle}/>
                </Switch>
                </BrowserRouter>
            </div>
        )
    }
}
export default Main;