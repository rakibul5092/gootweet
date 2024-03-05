import { Injectable, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
} from "@angular/fire/compat/firestore";
import { BehaviorSubject, Subscription } from "rxjs";
import { first, map } from "rxjs/operators";
import {
  innercategories,
  portfolio,
  products,
  users,
  wallpost,
} from "../../../constants";
import { Portfolio, PortfolioData } from "../../../models/portfolio";
import { Product } from "../../../models/product";
import { User } from "../../../models/user";
import { WallPost, WallPostData } from "../../../models/wall-test";
interface InnerCategory {
  ref?: any;
  id: string;
  inner_category: string;
  count: number;
  serial?: number;
}
@Injectable({
  providedIn: "root",
})
export class ProfileService implements OnDestroy {
  manufacturer: User;

  public nextQueryAfter: QueryDocumentSnapshot<WallPostData>;
  startAfter: QueryDocumentSnapshot<Product>;

  private findSub: Subscription;
  private findSubProduct: Subscription;

  wallPosts: WallPost[] = [];
  products: Product[] = [];
  innerCategories = new BehaviorSubject<InnerCategory[]>([]);
  selectedInnerCategoryId: string;
  selectedInnerCategory: string;

  findCalled = false;

  //For Designer
  portfolios: PortfolioData[] = [];
  findPortfolioCalled = false;
  nextQueryAfterPort: QueryDocumentSnapshot<Portfolio>;
  noProductsFound = new BehaviorSubject(false);

  constructor(private angularFirestore: AngularFirestore) {}
  ngOnDestroy(): void {
    this.destroy();
  }

  destroy() {
    this.nextQueryAfter = null;
    this.unsubscribe();
    this.wallPosts = [];
    this.nextQueryAfter = null;
  }

  private unsubscribe() {
    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  getWallpost(
    queryAfter: QueryDocumentSnapshot<WallPostData>,
    myUid
  ): AngularFirestoreCollection<WallPostData> {
    if (queryAfter) {
      return this.angularFirestore.collection(wallpost, (ref) =>
        ref
          .where("owner.uid", "==", myUid)
          .orderBy("timestamp", "desc")
          .startAfter(queryAfter)
          .limit(10)
      );
    } else {
      return this.angularFirestore.collection(wallpost, (ref) =>
        ref
          .where("owner.uid", "==", myUid)
          .orderBy("timestamp", "desc")
          .limit(10)
      );
    }
  }

  private unsubscribeProduct() {
    if (this.findSubProduct) {
      this.findSubProduct.unsubscribe();
    }
  }

  findProduct(myUid: string, isMobile = false) {
    if (this.findSubProduct) {
      this.findSubProduct.unsubscribe();
    }

    try {
      let collection: AngularFirestoreCollection<Product> =
        this.getProductQuery(myUid);
      this.unsubscribeProduct();
      this.getProducts(collection, isMobile);
    } catch (err) {
      throw err;
    }
  }

  private getProductQuery(myUid: string): AngularFirestoreCollection<Product> {
    if (this.selectedInnerCategoryId) {
      if (this.startAfter) {
        return this.angularFirestore
          .collection<Product>(products)
          .doc(myUid)
          .collection(products, (ref) =>
            ref
              .where(
                "inner_category.data.inner_category",
                "==",
                this.selectedInnerCategory
              )
              .orderBy("timestamp", "desc")
              .startAfter(this.startAfter)
              .limit(20)
          );
      } else {
        return this.angularFirestore
          .collection<Product>(products)
          .doc(myUid)
          .collection(products, (ref) =>
            ref
              .where(
                "inner_category.data.inner_category",
                "==",
                this.selectedInnerCategory
              )
              .orderBy("timestamp", "desc")
              .limit(20)
          );
      }
    } else {
      const indexedInnerCategory =
        this.innerCategories.value[this.index].inner_category;

      if (this.startAfter) {
        return this.angularFirestore
          .collection<Product>(products)
          .doc(myUid)
          .collection(products, (ref) =>
            ref
              .orderBy("timestamp", "desc")
              .startAfter(this.startAfter)
              .limit(20)
          );
      } else {
        return this.angularFirestore
          .collection<Product>(products)
          .doc(myUid)
          .collection(products, (ref) =>
            ref.orderBy("timestamp", "desc").limit(20)
          );
      }
    }
    // else {
    //   const indexedInnerCategory =
    //     this.innerCategories.value[this.index].inner_category;

    //   if (this.startAfter) {
    //     return this.angularFirestore
    //       .collection<Product>(products)
    //       .doc(myUid)
    //       .collection(products, (ref) =>
    //         ref
    //           .where(
    //             "inner_category.data.inner_category",
    //             "==",
    //             indexedInnerCategory
    //           )
    //           .startAfter(this.startAfter)
    //           .limit(20)
    //       );
    //   } else {
    //     return this.angularFirestore
    //       .collection<Product>(products)
    //       .doc(myUid)
    //       .collection(products, (ref) =>
    //         ref
    //           .where(
    //             "inner_category.data.inner_category",
    //             "==",
    //             indexedInnerCategory
    //           )
    //           .limit(20)
    //       );
    //   }
    // }
  }

  index = 0;
  getProducts(
    collection: AngularFirestoreCollection<Product>,
    isMobile: boolean
  ) {
    this.findSubProduct = collection
      .get()
      .pipe(first())
      .subscribe((query) => {
        if (
          query.docs.length < 20 &&
          this.index < this.innerCategories.value.length
        ) {
          this.index++;
          this.startAfter = null;
        } else {
          if (query && query.docs.length > 0) {
            this.startAfter = query.docs[
              query.docs.length - 1
            ] as QueryDocumentSnapshot<Product>;
          }
        }
        if (!this.startAfter && query.docs.length === 0) {
          this.noProductsFound.next(true);
        } else {
          this.noProductsFound.next(false);
        }

        const length = this.products.length;
        query.docs.forEach((item, index) => {
          let product: Product = item.data();
          product.id = item.id;
          if (length > 19 && isMobile) {
            if (index < 10) {
              this.products.splice(length / 2 + index, 0, product);
            } else {
              this.products.splice(length - 1 + index, 0, product);
            }
          } else {
            this.products.push(product);
          }
        });
      });
  }

  getSingleProduct(uid, id) {
    return this.angularFirestore
      .collection(products)
      .doc(uid)
      .collection(products)
      .doc(id);
  }

  getProductOwner(uid) {
    return this.angularFirestore.collection(users).doc(uid);
  }

  findPortfolio(myUid: string) {
    if (this.findPortfolioCalled) {
      return;
    }
    this.findPortfolioCalled = true;
    try {
      let collection: AngularFirestoreCollection<Portfolio> =
        this.getPortfolioCollectionQuery(myUid);
      this.unsubscribe();
      this.queryPortfolio(collection);
    } catch (err) {
      throw err;
    }
  }

  private getPortfolioCollectionQuery(
    myUid: string
  ): AngularFirestoreCollection<Portfolio> {
    if (this.nextQueryAfterPort) {
      return this.angularFirestore
        .collection<Portfolio>(portfolio)
        .doc(myUid)
        .collection(portfolio, (ref) =>
          ref
            .orderBy("timestamp", "desc")
            .startAfter(this.nextQueryAfterPort)
            .limit(20)
        );
    } else {
      return this.angularFirestore
        .collection<Portfolio>(portfolio)
        .doc(myUid)
        .collection(portfolio, (ref) =>
          ref.orderBy("timestamp", "desc").limit(20)
        );
    }
  }

  private queryPortfolio(collection: AngularFirestoreCollection<Portfolio>) {
    try {
      collection
        .get()
        .pipe(first())
        .subscribe((query) => {
          if (query && query.docs.length > 0) {
            this.nextQueryAfterPort = query.docs[
              query.docs.length - 1
            ] as QueryDocumentSnapshot<Portfolio>;
          }
          query.forEach((item) => {
            let id = item.id;
            let data = item.data() as Portfolio;
            this.portfolios.push({ data: data, id });
          });
          this.findPortfolioCalled = false;
        });
    } catch (e) {
      console.log(e);
    }
  }

  subCatLoaded = 0;
  getInnerCategories(uid: string) {
    this.subCatLoaded = 0;
    this.angularFirestore
      .collection(products)
      .doc(uid)
      .collection(innercategories, (ref) =>
        ref.orderBy("products_count", "asc").where("products_count", ">", 0)
      )
      .get()
      .pipe(
        first(),
        map((actions) =>
          actions.docs.map((a) => {
            let innerCat = a.data() as InnerCategory;
            if (!innerCat.serial) {
              innerCat.serial = 0;
            }
            innerCat.id = a.id;
            innerCat.ref = a.ref;
            return innerCat;
          })
        )
      )
      .subscribe((data) => {
        data = data.sort(compareFn);
        if (data.length == 0) {
          this.subCatLoaded = 2;
        } else {
          this.subCatLoaded = 1;
        }
        this.innerCategories.next(data);
      });
  }

  async onSaveInners() {
    const batch = this.angularFirestore.firestore.batch();
    for (const inner of this.innerCategories.value) {
      batch.update(inner.ref, { serial: inner.serial });
    }
    await batch.commit();
  }
}
const compareFn = (a, b) => {
  return b.serial - a.serial;
};
