import { act, findAllByTitle } from '@testing-library/react';
import React, { Component } from 'react';

class Stories extends Component {
    state = {
        stories: [],
        currentPage: 0,
        activePage: 1
    }

    componentDidMount = () => {
        let pageNo = this.state.currentPage;
        this.getStories(pageNo);
        this.interval = setInterval(() => {
            this.setState({
                currentPage: this.state.currentPage + 1
            })
            this.getStories(this.state.currentPage);
        }, 10000)
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }
    getStories = (page) => {
        fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                stories: [...this.state.stories, data.hits]
            })
        })
    }

    handleNextPage = (e) => {
        this.setState({
            activePage: this.state.activePage + 1
        })
    }

    handlePrevPage = () => {
        this.setState({
            activePage: this.state.activePage - 1
        })
    }

    render() {
        const { activePage, currentPage, stories } = this.state;
        return (
            <div className="container">
                <div className="pagination">
                    {
                        activePage > 1 ? <button className="ml-10" onClick= {this.handlePrevPage}>Prev</button> : null
                    }
                    <span className="ml-10">{activePage} of</span> 
                    <span className="ml-10">{currentPage > 0 ? currentPage : 1}</span>
                    <button className="ml-10" onClick= {this.handleNextPage}>Next</button>
                </div>
                <table border="1" className="mt40">
                    <thead>
                        <tr>
                        <th>Title</th>
                        <th>URL</th>
                        <th>Created At</th>
                        <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    stories[activePage-1] && stories[activePage-1].map((story, i) => {
                        // const { title, url, created_at, author } = story;
                        return(<tr className="story-wrapper" key={i}>
                            <td>{story.title}</td>
                            <td><a href={story.url} target="_blank">{story.url}</a></td>
                            <td>{story.created_at}</td>
                            <td>{story.author}</td>
                        </tr>)
                    })
                }
                    </tbody>
                </table>
                
            </div>
        );
    }
}

export default Stories;