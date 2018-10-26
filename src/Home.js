import React, {Component} from 'react';
import './Home.css';
import {callApi} from "./utils/apiHelper";
import {scrollToTop} from "./utils/utilities";
import CONSTANTS from "./utils/constants"
import Sorter from "./sorter"

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            originalSources: [],
            sources: [],
            originalArticles: [],
            articles: [],
            isLoading: true,
            errorMessage: "",
            selectedSource: ""

        };
        this.renderSources = this.renderSources.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.loadArticles = this.loadArticles.bind(this);
        this.onImageError = this.onImageError.bind(this);
        this.onSourcesSorted = this.onSourcesSorted.bind(this);
        this.onArticlesSorted = this.onArticlesSorted.bind(this);
        this.openArticle = this.openArticle.bind(this);
    }

    /*
        For handling article image not present , used default image , this can be kept locally , used online url for demo
     */
    onImageError(e) {
        e.target.src = "https://data.bloomberglp.com/media/sites/14/2015/05/noun_89366.svg";
    }

    loadArticles(sourceId) {
        let self = this;
        self.setState({
            articles: [],
            selectedSource: sourceId,
            originalArticles: []
        });
        callApi(CONSTANTS.ARTICLES_API_URL + "&source=" + sourceId, function (successResponse) {
            self.setState({
                articles: successResponse.response.articles,
                originalArticles: successResponse.response.articles
            });
            scrollToTop();
        }, function (errorResponse) {
            scrollToTop();
            self.setState({
                errorMessage: errorResponse.error
            });
            setTimeout(function () {
                self.setState({
                    errorMessage: ""
                });
            }, 3000);
        });
    }


    componentWillMount() {
        let self = this;
        callApi(CONSTANTS.SOURCES_API_URL, function (successResponse) {
            console.log(successResponse);
            self.setState({
                isLoading: false,
                originalSources: successResponse.response.sources,
                sources: successResponse.response.sources
            });
        }, function (errorResponse) {
            self.setState({
                isLoading: false
            });
            self.setState({
                errorMessage: errorResponse.error
            });
            setTimeout(function () {
                self.setState({
                    errorMessage: ""
                });
            }, 3000);
        });
    }

    render() {
        return (
            <div className="App">
                <a className="search-link" href="/searchArticle">Search Articles</a>
                {this.state.isLoading ? this.renderLoading() : this.renderSources()}
            </div>
        );
    }

    onSourcesSorted(sortedData) {
        this.setState({
            sources: sortedData,
            articles: [],
            selectedSource : ""
        });
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
                    <Sorter options={["name","description","category"]} onDataSorted={this.onSourcesSorted} data={self.state.originalSources}/>
                    <ul >
                        {
                            this.state.sources && this.state.sources.map(function (sourceValue, sIndex) {
                                return (
                                    <li key={sIndex} onClick={() => self.loadArticles(sourceValue.id)}
                                        className={self.state.selectedSource === sourceValue.id ? "selected-source" : ""}>
                                        <p><label className="option-label">Name</label>: {sourceValue.name} </p>
                                        <p><label
                                            className="option-label">Description</label>: {sourceValue.description}
                                        </p>
                                        <p><label className="option-label">Category</label>: {sourceValue.category} </p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="listStyle">
                    <Sorter options={["title","description"]} onDataSorted={this.onArticlesSorted} data={self.state.originalArticles}/>
                    <ul>
                        {
                            self.state.articles && self.state.articles.map(function (articleValue, aIndex) {
                                return (
                                    <li key={aIndex} onClick={() =>self.openArticle(articleValue.url,articleValue.title)}>
                                        <img src={articleValue.urlToImage} onError={(e) => self.onImageError(e)}
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
                </div>
            </div>
        )
    }

    renderLoading() {
        return (
            <div className="centered">
                <h2>Loading...</h2>
            </div>
        )
    }
    openArticle(url, title){
        window.open(url, "_blank", title);

    }

}

export default Home;
