import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { AddCategoriesService } from "src/app/home-main/admin/categories/categories-popup/add-categories.service";
import { CategoriesService } from "src/app/home-main/admin/categories/categories.service";
import {
  Category,
  CategoryData,
  InnerCategory,
  InnerCategoryData,
  SubCategory,
  SubCategoryData,
} from "src/app/models/category";
import { User } from "src/app/models/user";
import { getUser } from "../../../../services/functions/functions";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-api-instructions",
  templateUrl: "./api-instructions.page.html",
  styleUrls: ["./api-instructions.page.scss"],
})
export class ApiInstructionsPage implements OnInit {
  me: User;

  selectedCategory: Category = {
    id: "",
    data: { timestamp: "", products_count: 0, category: "" },
  };
  selectedSubCategory: SubCategory = {
    data: { timestamp: "", sub_category: "", category_id: "" },
    id: "",
  };
  selectedInnerCategory: InnerCategory = {
    id: "",
    data: { timestamp: "", sub_category_id: "", inner_category: "" },
  };

  category: any;
  subCategory: any;
  innerCategory: any;

  finalCategoryForm = "";
  constructor(
    private popoverController: PopoverController,
    public categoryService: CategoriesService,
    public addCategoryService: AddCategoriesService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginService.getUser().then((user: User) => {
      if (user) {
        this.categoryService.init(user);
        this.me = user;
      }
    });
  }
  changeCategory() {
    this.addCategoryService.getSubCategories(this.selectedCategory.id);
    this.addCategoryService.innerCategories = [];

    this.initCat();
    this.selectedSubCategory = {
      data: { timestamp: "", sub_category: "", category_id: "" },
      id: "",
    };
    this.category = {
      category: this.selectedCategory?.data?.category || "",
      id: this.selectedCategory.id,
    };
  }
  changeSubCategory() {
    this.addCategoryService.getInnerCategories(this.selectedSubCategory.id);
    this.initCat();
    this.selectedInnerCategory = {
      id: "",
      data: { timestamp: "", sub_category_id: "", inner_category: "" },
    };
    this.subCategory = {
      sub_category: this.selectedSubCategory?.data.sub_category || "",
      id: this.selectedSubCategory.id,
    };
  }
  changeInnerCategory() {
    this.initCat();
    this.innerCategory = {
      inner_category: this.selectedInnerCategory?.data?.inner_category || "",
      id: this.selectedInnerCategory.id,
    };
  }

  dismiss() {
    this.popoverController.dismiss();
  }
  initCat() {
    this.finalCategoryForm =
      '"category": "' +
      this.selectedCategory.data.category +
      '", "sub_category":"' +
      this.selectedSubCategory.data.sub_category +
      '", "inner_category":"' +
      this.selectedInnerCategory.data.inner_category +
      '"';
  }

  structureNormal = `
  {
    "api_key": "Your api key",
    "baseUrl": "www.your-website.com",      // base url for product images to upload(without image name, only image path)
    "products": [
        {    
            "product_id":"1",       // produkto ID
            "title": "žaliuzes",    // Pavadinimas //
             "category": "Ikea",    // Kategorija //

            "sub_category": "ikea sub",  // subkategorija //

            "inner_category": "ikeaa inner 2",  // vidinė kategorija //

            "good": {           // Paprasta prekė //
                "price": "1",    // Kaina //
                "unit": "M2",       // Mato vienetas //
                "quantity": "100",  // Kiekis pakuotėje //
                "inStock": "1",      // Sandėlyje //
                "expectedStock": "10 days",    // būsimos atsargos //
                "colors": ["blue"]      // colors //
            },
            "main_images": [     // Nuotrauka //
                "image-folder/ingo-table-pine__0737092_PE740877_S5.JPG"
            ],  
            "aditional_images": [    // Papildoma Nuotrauka //
                "image-folder/ingo-table-pine__0737092_PE740877_S3.JPG"
            ],
            "description": "Roletai Diena naktis (arba kitaip – Zebra roletai) – tai dvisluoksniai roletai, gaminami iš horizontaliai dryžuoto permatomo ir nepermatomo audinio. Pastaruoju metu tai vienas populiariausių langų dekoro elementų, itin mėgstamas dėl savo praktiškumo. Roletai Diena naktis leidžia nesunkiai reguliuoti šviesos kiekį patalpoje, nepakeliant paties roleto į viršų, ir yra puiki alternatyva tiek dieninėms, tiek naktinėms užuolaidoms.",

            "measures": [   // Specifikacijos  //
                {
                    "name": "plotis",
                    "measure": "155"
                }
            ],

            "delivery_types": [     // Pristatymo informacija //
                {
                    "delivery_info": {
                        "delivery_time": "",
                        "option": "charge",  //jei nemokamai irasyti  ''free''  jei nemokamai ''free''   tai kainos nereikia arba rasyti iverti 0. //
                        "price": "100"
                    },
                    "destination": "Lithuania"   // kelionės tikslas
                },
                {
                    "delivery_info": {
                        "delivery_time": "",
                        "option": "charge",  //jei nemokamai irasyti  ''free''  jei nemokamai ''free''   tai kainos nereikia arba rasyti iverti 0. //
                        "price": "100"
                    },
                    "destination": "Kuršių neriją"  // kelionės tikslas
                }
            ]
        }
    ]
}
`;

  structureVariation = `
  {
    "api_key": "Your api key",
    "baseUrl": "www.your-website.com",
    "products": [
        {    
            "product_id":"1",       // produkto ID
            "title": "žaliuzes",    // Pavadinimas //
             "category": "Ikea",    // Kategorija //

            "sub_category": "ikea sub",  // subkategorija //

            "inner_category": "ikeaa inner 2",  // vidinė kategorija //

            "good":[    // Prekė su variacijomis  //
                {
                    "material":"material name", // medziagos pavadinimas //
                    "price": "1",    // medziagos Kaina //
                    "unit": "M2",       // Mato vienetas  //
                    "quantity": "100",  // Kiekis pakuotėje //
                    "inStock": "1",      // Sandėlyje //
                    "expectedStock": "10 days",    // būsimos atsargos  
                    "images": "image-folder/ingo-table-pine__0737092_PE740877_S5.JPG",   // Medžiagos nuotrauka  //
                    "description": "material description",      // medziagos aprasmymas, apibūdinimas //
                    "code": "material code"     // Medžiagos kodas //
                    "category": "category",     // Medžiagos kategorija
                    "sub_category": "subCategory"   // Medžiagos subkategorija
                }
            ],
           "main_images": [     // Nuotrauka
                "image-folder/ingo-table-pine__0737092_PE740877_S5.JPG"
            ],  
            "aditional_images": [    // Papildoma Nuotrauka
                "image-folder/ingo-table-pine__0737092_PE740877_S3.JPG"
            ],
            "description": "Roletai Diena naktis (arba kitaip – Zebra roletai) – tai dvisluoksniai roletai, gaminami iš horizontaliai dryžuoto permatomo ir nepermatomo audinio. Pastaruoju metu tai vienas populiariausių langų dekoro elementų, itin mėgstamas dėl savo praktiškumo. Roletai Diena naktis leidžia nesunkiai reguliuoti šviesos kiekį patalpoje, nepakeliant paties roleto į viršų, ir yra puiki alternatyva tiek dieninėms, tiek naktinėms užuolaidoms.",

            "measures": [   // Specifikacijos //
                {
                    "name": "plotis",
                    "measure": "155"
                }
            ],

            "delivery_types": [     // Pristatymo informacija //
                
                {
                    "delivery_info": {
                        "delivery_time": "",
                        "option": "charge"  //jei nemokamai irasyti  ''free''  jei nemokamai ''free''   tai kainos nereikia arba rasyti iverti 0. //
                        "price": "100",
                    },
                    "destination": "Kuršių neriją"  // kelionės tikslas
                },
                {
                    "delivery_info": {
                        "delivery_time": "",
                        "option": "charge"  //jei nemokamai irasyti  ''free''  jei nemokamai ''free''   tai kainos nereikia arba rasyti iverti 0. //
                        "price": "100",
                    },
                    "destination": "Kuršių neriją"  // kelionės tikslas
                }
            ]
        }
    ]
}
`;

  responseSuccess = `{
        error: false,
        status: 'done',
        products: [],

    }`;
  responseFailed = `{
        error: true
        status: 'unauthenticated',
    }`;
}
