import { Injectable } from "@angular/core";
import algoliaserch, { SearchIndex } from "algoliasearch";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductFilterService {
  public loaded = false;
  searchConfig = {
    ...environment.algolia,
    indexName: "products",
  };
  public searchResult: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public searchInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  private index: SearchIndex;
  search_query: string;
  searchEnded = false;
  private hitPerPage: number;
  private isCategory = true;
  searching = false;
  page = 0;
  loadingNextPage = false;
  noProductFound = new BehaviorSubject<boolean>(false);

  constructor() {}

  initSearch(
    indexName: string = "products",
    hitPerPage = 10,
    uid: string = "",
    isCat = true
  ) {
    this.searchConfig.indexName = indexName;
    this.hitPerPage = hitPerPage;
    const client = algoliaserch(
      this.searchConfig.appId,
      this.searchConfig.apiKey
    );
    this.index = client.initIndex(this.searchConfig.indexName);
    this.isCategory = isCat;
    if (uid) {
    }
    this.page = 0;
  }

  initQuery(query: string) {
    this.search_query = query;
    this.searchEnded = false;
    this.searchResult.next([]);
    this.loadingNextPage = true;
  }

  async onFilter(page: number = 0) {
    this.loaded = false;
    this.page = page;
    const queries = await this.index.search(this.search_query, {
      page: page,
      hitsPerPage: this.hitPerPage,
    });
    if (queries.hits.length > 0) {
      this.noProductFound.next(false);
      const hits = await this.dataMap(queries.hits);
      this.searchInfo.next({
        from: 1,
        to:
          queries.nbPages - 1 === queries.page
            ? queries.nbHits
            : queries.hitsPerPage * queries.page + queries.hitsPerPage,
      });

      if (this.searchResult.getValue().length > 0 && !this.isCategory) {
        const length = this.searchResult.getValue().length;
        const prevData = this.searchResult.getValue();
        prevData.splice(length - 1, 0, ...hits.slice(10));
        prevData.splice(length / 2 - 1, 0, ...hits.slice(0, 10));
        this.searchResult.next(prevData);
      } else {
        this.searchResult.next(this.searchResult.getValue().concat(hits));
      }
      this.loaded = true;
      this.loadingNextPage = false;
    } else {
      if (page === 0 && queries.hits.length === 0) {
        this.noProductFound.next(true);
      } else {
        this.noProductFound.next(false);
      }
      this.searchEnded = true;
    }
  }

  dataMap(hits): Promise<any[]> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isCategory) {
          resolve(
            hits.map((item) => {
              item.original_data = { ...item.original_data, id: item.objectID };
              return item;
            })
          );
        } else {
          resolve(
            hits.map((item) => ({
              ...item.original_data,
              id: item.objectID,
              uid: item.uid,
              objectID: item.objectID,
            }))
          );
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
