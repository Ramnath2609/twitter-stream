import React from 'react';
import io from 'socket.io-client'
import InfiniteScroll from 'react-infinite-scroll-component'



class App extends React.Component{
  constructor(){
    super()
    this.state = {
      tweets : [],
      keyword : '',
      loadMore : false,
      hidebutton : true
    }

    this.socket = io('localhost:3265')
    this.socket.on('RECIEVE_TWEETS', function(data){
      addTweets(data)
    })

    const addTweets = (data) => {
      this.setState({ tweets : [...this.state.tweets, data ]})
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name ] : e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.socket.emit('GET_TWEETS', this.state.keyword)
  }

  fetchData = () => {
    this.socket.emit('GET_TWEETS', this.state.keyword)
  }

  handleClick = () => {
    this.setState({ loadMore : true, hidebutton : false })
  }

  render() {
    return (
      <div>
        <nav class="navbar navbar-light" style = {{backgroundColor : '#74b9ff'}}>
          <span className = "navbar-brand">Twitter</span>
        </nav>
        <div className = "row">
          <div className = "offset-md-1 col-md-2">
            <ul className="list-group list-group-flush text-center">
                <li className="list-group-item"></li>
                <li className="list-group-item">Home</li>
                <li className="list-group-item">Explore</li>
                <li className="list-group-item">Notifications</li>
                <li className="list-group-item">Messages</li>
                <li className="list-group-item">Bookmarks</li>
                <li className="list-group-item">Lists</li>
                <li className="list-group-item">Profile</li>
            </ul>
          </div>
          <div className = "col-md-6 border-left border-right">
            <h3>Home</h3><br/>
            <div className="form-group">
                <textarea className="form-control" placeholder = "What's happening" rows="3"></textarea>
            </div>
            <div>
         <ul>
           {
             this.state.tweets.slice(0, 10).map(tweet => {
             return <div key = {tweet.id} className="card">
                      <div className="card-header">
                        { tweet.user.screen_name}
                      </div>
                      <div className="card-body">
                        <blockquote className="blockquote mb-0">
                          <p>{tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text}</p>                        </blockquote>
                      </div>
                    </div>
             })
           }
         </ul>
         { this.state.tweets.length != 0 && this.state.hidebutton ? <button onClick = { this.handleClick }>Load more</button> : ''}
         { this.state.loadMore && (
            <InfiniteScroll
            dataLength={this.state.tweets.length}
            next={this.fetchData}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>Yay! You have seen it all</b>
              </p>
            }>
            <ul className = "list-group list-group-flush">
              {    
                this.state.tweets.slice(10).map(tweet => {
                  return <div key = {tweet.id} className="card">
                            <div className="card-header">
                              { tweet.user.screen_name}
                            </div>
                            <div className="card-body">
                              <blockquote className="blockquote mb-0">
                                <p>{tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text}</p>                              </blockquote>
                            </div>
                          </div>
                })
              }
            </ul>
          </InfiniteScroll>
         )}
       </div>
          </div>
          <div className = "col-md-2">
            <form className = "form-group  mx-sm-3 mb-2" onSubmit = { this.handleSubmit }>
              <input type = "text" className = "form-control" value = { this.state.keyword } onChange = { this.handleChange } name="keyword" />
              <button type="submit" className = "btn btn-primary btn-sm">Search</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default App;


