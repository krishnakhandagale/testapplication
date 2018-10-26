import React, {Component} from 'react';
import './Home.css';
import {callApi} from "./utils/apiHelper";
import  CONSTANTS from "./utils/constants"
import Sorter from "./sorter"

class SearchArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            originalArticles: [],
            isLoading: false,
            errorMessage: "",
            searchText: ""

        };
        this.searchThresholdTimeout = null;
        this.renderSources = this.renderSources.bind(this);
        SearchArticle.renderLoading = SearchArticle.renderLoading.bind(this);
        this.loadArticles = this.loadArticles.bind(this);
        SearchArticle.onImageError = SearchArticle.onImageError.bind(this);
        this.onArticlesSorted = this.onArticlesSorted.bind(this);
        SearchArticle.openArticle = SearchArticle.openArticle.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.onSearchKeyUp = this.onSearchKeyUp.bind(this);
    }

    static onImageError(e) {
        e.target.src = "https://data.bloomberglp.com/media/sites/14/2015/05/noun_89366.svg";
    }
    onSearchKeyUp(){
        let self = this;
        if(this.searchThresholdTimeout){
            clearTimeout(this.searchThresholdTimeout);
        }
        this.searchThresholdTimeout = setTimeout(function () {
            if(self.state.searchText.length >= CONSTANTS.SEARCH_TEXT_THRESHOLD){
                self.loadArticles(self.state.searchText);
            }else{
                self.setState({
                    errorMessage: "Enter minimum 3 characters to search.",
                    isLoading: false
                });
                setTimeout(function () {
                    self.setState({
                        errorMessage: ""
                    });
                }, 3000);
            }
        }, CONSTANTS.SEARCH_TIME_THRESHOLD);
    }
    onSearchTextChange(e){
        let self = this;
        self.setState({
            searchText: e.target.value
        });

    }
    loadArticles(searchTerm) {
        if(searchTerm){
            let self = this;
            self.setState({
                articles: [],
                originalArticles:[],
                isLoading: true
            });
            callApi(CONSTANTS.ARTICLES_SEARCH_API_URL + "&q=" + searchTerm, function (successResponse) {
                self.setState({
                    articles: successResponse.response.articles,
                    originalArticles: successResponse.response.articles,
                    isLoading: false
                });
            }, function (errorResponse) {
                self.setState({
                    errorMessage: errorResponse.error,
                    isLoading: false
                });
                setTimeout(function () {
                    self.setState({
                        errorMessage: ""
                    });
                }, 3000);
            });
        }
    }


    componentWillMount() {
    }

    render() {
        return (
            <div className="App">
                <a className="search-link-article" href="/">Home</a>
                <input type="text" placeholder="Search Articles..."  className="searchTerm" onChange={(e) => this.onSearchTextChange(e)} value={this.state.searchText} onKeyUp={() => this.onSearchKeyUp()}/>
                {this.state.isLoading ? SearchArticle.renderLoading() : this.renderSources()}
            </div>
        );
    }


    onArticlesSorted(sortedData) {
        this.setState({
            articles: sortedData
        });
    }

    renderSources() {
        let self = this;
        return (
            <div>
                {
                    this.state.errorMessage && <div className="errorMessage">
                        {
                            this.state.errorMessage
                        }
                    </div>
                }

                <div className="listStyle">
                    {self.state.articles && self.state.articles .length ?  <Sorter options={["title","description"]} onDataSorted={this.onArticlesSorted} data={self.state.originalArticles}/> : null}
                    <ul>
                        {
                            self.state.articles && self.state.articles.map(function (articleValue, aIndex) {
                                return (
                                    <li key={aIndex} onClick={() =>SearchArticle.openArticle(articleValue.url,articleValue.title)}>
                                        <img src={articleValue.urlToImage} onError={(e) => SearchArticle.onImageError(e)}
                                             className="article-image"/>
                                        <p><label className="option-label">Name</label>: {articleValue.title} </p>
                                        <p><label
                                            className="option-label">Description</label>: {articleValue.description}</p>
                                        <p><label className="option-label">Author</label>: {articleValue.author ?
                                            <a href={articleValue.author}
                                               target="_blank"> {articleValue.author}</a> : "No author specified."} </p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    {!self.state.articles .length ?<p>No article found. Search something different above.</p> : null}
                </div>
            </div>
        )
    }

    static renderLoading() {
        return (
            <div className="centered">
                <h1>Loading...</h1>
            </div>
        )
    }
    static openArticle(url, title){
        window.open(url, "_blank", title);

    }

}

export default SearchArticle;
