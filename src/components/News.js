import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  articles = [
    {
      source: { id: "news24", name: "News24" },
      author: "Khanyiso Tshwaku",
      title:
        "'I've never experienced AB de Villiers to be racist,' says former Proteas manager Moosajee",
      description:
        "Former Proteas team manager and doctor Mohammed Moosajee said he did not experience racism from former Proteas cricketer AB de Villiers.",
      url: "https://www.news24.com/sport/Cricket/Proteas/ive-never-experienced-ab-de-villiers-to-be-racist-says-former-proteas-manager-moosajee-20211021",
      urlToImage:
        "https://cdn.24.co.za/files/Cms/General/d/4204/9088f2ef7edc4119be5de26efda9145d.jpg",
      publishedAt: "2021-10-21T10:10:43+00:00",
      content:
        "<ul><li>Former Proteas team manager Mohammed Moosajee said he didn't experience racism from former Proteas cricketer AB de Villiers.</li><li>De Villiers is at the heart of the 2015 selection saga whe… [+3266 chars]",
    },
    {
      source: { id: "espn-cric-info", name: "ESPN Cric Info" },
      author: null,
      title:
        "PCB hands Umar Akmal three-year ban from all cricket | ESPNcricinfo.com",
      description:
        "Penalty after the batsman pleaded guilty to not reporting corrupt approaches | ESPNcricinfo.com",
      url: "http://www.espncricinfo.com/story/_/id/29103103/pcb-hands-umar-akmal-three-year-ban-all-cricket",
      urlToImage:
        "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1099495_800x450.jpg",
      publishedAt: "2020-04-27T11:41:47Z",
      content:
        "Umar Akmal's troubled cricket career has hit its biggest roadblock yet, with the PCB handing him a ban from all representative cricket for three years after he pleaded guilty of failing to report det… [+1506 chars]",
    },
    {
      source: { id: "espn-cric-info", name: "ESPN Cric Info" },
      author: null,
      title:
        "What we learned from watching the 1992 World Cup final in full again | ESPNcricinfo.com",
      description:
        "Wides, lbw calls, swing - plenty of things were different in white-ball cricket back then | ESPNcricinfo.com",
      url: "http://www.espncricinfo.com/story/_/id/28970907/learned-watching-1992-world-cup-final-full-again",
      urlToImage:
        "https://a4.espncdn.com/combiner/i?img=%2Fi%2Fcricket%2Fcricinfo%2F1219926_1296x729.jpg",
      publishedAt: "2020-03-30T15:26:05Z",
      content:
        "Last week, we at ESPNcricinfo did something we have been thinking of doing for eight years now: pretend-live ball-by-ball commentary for a classic cricket match. We knew the result, yes, but we tried… [+6823 chars]",
    },
  ];
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: this.articles,
      loading: false,
      page: 1,
    };
    document.title = `${this.capitalize(this.props.category)} - NewsMonkey`;
  }

  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=763d1bb7ebc7467190c25b4ae3eb7509&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  async updateNews(pageNO) {
    this.props.setProgress(0);
    let url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${
      this.props.category
    }&apiKey=763d1bb7ebc7467190c25b4ae3eb7509&page=${
      this.state.page - 1
    }&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      page: this.state.page - 1,
      articles: parsedData.articles,
      loading: false,
      totalResults : 0
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async() => {
    this.setState({
      page: this.state.page + 1,
    })
    let url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${
      this.props.category
    }&apiKey=763d1bb7ebc7467190c25b4ae3eb7509&page=${
      this.state.page - 1
    }&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      page: this.state.page - 1,
      articles: this.state.articles.concat(parsedData.articles) ,
      loading: false,
      totalResults : 0
  })
};

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">
          NewsMonkey - Top {this.capitalize(this.props.category)} Headlines
        </h1>
        {/* {this.state.loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
          
        <div className="row">
          {this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  newsUrl={element.url}
                  imageUrl={element.urlToImage}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
        
            );
          })}
        </div>
        
        </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default News;
