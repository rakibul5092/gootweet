import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GiphyService {
  private apiKey = "bnpoania8q6iBfO6VyLp19uNt8Zge1Iw";
  private query: string;

  constructor(private http: HttpClient) {}

  getGifs() {
    return this.http.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${this.query}&limit=50&offset=0&rating=G&lang=en`
    );
  }

  trendingGifs() {
    return this.http.get(
      `https://api.giphy.com/v1/gifs/trending?api_key=${this.apiKey}&limit=50&rating=G`
    );
  }

  randomGif() {
    return this.http.get(
      `https://api.giphy.com/v1/gifs/random?api_key=${this.apiKey}&tag=&rating=R`
    );
  }

  searchGifs(query: string) {
    this.query = query;
  }
}
