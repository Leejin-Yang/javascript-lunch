import "./RestaurantCardList.style.css";

import type {
  CategoryFilterOption,
  SortingFilterOption,
} from "../types/option";
import type { Restaurant } from "../types/restaurant";

import restaurantState from "../states/restaurants";
import RestaurantCard from "./RestaurantCard";

class RestaurantCardList extends HTMLUListElement {
  #category: CategoryFilterOption;

  #sorting: SortingFilterOption;

  #restaurants: Restaurant[] | undefined;

  static get observedAttributes() {
    return ["category-filter", "sorting-filter", "data-length", "data-view"];
  }

  constructor() {
    super();

    this.#category = "전체";
    this.#sorting = "name";
    this.setRestaurants(this.dataset.view || "all");
  }

  connectedCallback() {
    this.setListOptionAttributes();
    this.render();
  }

  setListOptionAttributes() {
    this.setAttribute("category-filter", this.#category);
    this.setAttribute("sorting-filter", this.#sorting);
    this.setAttribute("data-length", restaurantState.length());
  }

  render() {
    if (!this.#restaurants) return;

    this.innerHTML = `${this.#restaurants
      .map(
        (restaurant) =>
          `<li is="restaurant-card" class="restaurant" name=${restaurant.name} data-restaurant-id=${restaurant.id}></li>`
      )
      .join("")}`;
  }

  attributeChangedCallback(
    attName: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue === null) return;
    if (newValue === null) return;
    if (oldValue === newValue) return;
    if (!this.dataset.view) return;

    if (this.isCategoryFilterAttribute(attName, newValue)) {
      this.#category = newValue;
    }

    if (this.isSortingFilterAttribute(attName, newValue)) {
      this.#sorting = newValue;
    }

    this.setRestaurants(this.dataset.view);
    this.render();
  }

  isCategoryFilterAttribute(
    attName: string,
    newValue: string
  ): newValue is CategoryFilterOption {
    return attName === "category-filter";
  }

  isSortingFilterAttribute(
    attName: string,
    newValue: string
  ): newValue is SortingFilterOption {
    return attName === "sorting-filter";
  }

  renderFavoriteView() {
    if (this.dataset.view === "favorite") {
      this.setRestaurants("favorite");
      this.render();
    }
  }

  setRestaurants(viewOption: string) {
    if (viewOption !== "all" && viewOption !== "favorite") return;

    if (viewOption === "favorite") {
      this.#restaurants = this.getFavoriteList(restaurantState.getList());
      return;
    }

    this.#restaurants = this.getListByOption(restaurantState.getList());
  }

  getListByOption(restaurants: Restaurant[]) {
    const filteredList = this.filterByCategory(restaurants);
    const sortedList = this.sortBySortOption(filteredList);

    return sortedList;
  }

  getFavoriteList(restaurants: Restaurant[]) {
    return restaurants.filter((restaurant) => restaurant.isFavorite);
  }

  sortBySortOption(restaurants: Restaurant[]) {
    if (this.#sorting === "name") {
      return [...restaurants].sort((first, second) =>
        first.name.localeCompare(second.name)
      );
    }

    return [...restaurants].sort(
      (first, second) => first.distance - second.distance
    );
  }

  filterByCategory(restaurants: Restaurant[]) {
    if (this.#category === "전체") return restaurants;

    return restaurants.filter(
      (restaurant) => restaurant.category === this.#category
    );
  }
}

export default RestaurantCardList;
