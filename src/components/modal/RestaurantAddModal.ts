import type { Category, Distance, Restaurant } from "../../types/restaurant";

import ModalContent from "./ModalContent";
import RestaurantCardList from "../RestaurantCardList";
import RestaurantOptionSelect from "../RestaurantOptionSelect";
import restaurantState from "../../states/restaurants";

class RestaurantAddModal extends ModalContent {
  constructor() {
    super();
  }

  render() {
    this.innerHTML = `
      <h2 class="modal-title text-title">새로운 음식점</h2>
      <form>
        <div class="form-item form-item--required">
          <label for="category">카테고리</label>
          <select is="restaurant-option-select" name="category" id="category" required></select>
        </div>
        <div class="form-item form-item--required">
          <label for="name">이름</label>
          <input type="text" name="name" id="name" required />
        </div>
        <div class="form-item form-item--required">
          <label for="distance">거리(도보 이동 시간)</label>
          <select is="restaurant-option-select" name="distance" id="distance" required></select>
        </div>
        <div class="form-item">
          <label for="description">설명</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
          ></textarea>
          <span class="help-text text-caption"
            >메뉴 등 추가 정보를 입력해 주세요.</span
          >
        </div>
        <div class="form-item">
          <label for="link">참고 링크</label>
          <input type="text" name="link" id="link" />
          <span class="help-text text-caption"
            >매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span
          >
        </div>
        <div class="button-container">
          <button
            type="button"
            id="cancel-button"
            class="button button--secondary text-caption"
          >
            취소하기
          </button>
          <button class="button button--primary text-caption">
            추가하기
          </button>
        </div>
      </form>
    `;
  }

  bindEvent(closeModal: () => void) {
    this.querySelector("form")?.addEventListener("submit", (event) => {
      this.onSubmit(event);
      closeModal();
    });

    this.querySelector("#cancel-button")?.addEventListener("click", () => {
      this.onClickCancelButton;
      closeModal();
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const newRestaurant = this.createRestaurant();
    restaurantState.add(newRestaurant);

    const $restaurantCardList =
      document.querySelector<RestaurantCardList>(".restaurant-list");
    $restaurantCardList?.setAttribute("data-length", restaurantState.length());
  }

  onClickCancelButton() {
    this.querySelector<HTMLFormElement>("form")?.reset();
  }

  createRestaurant(): Restaurant {
    const category = this.querySelector<RestaurantOptionSelect>("#category")
      ?.value as Category;
    const name = this.querySelector<HTMLInputElement>("#name")?.value || "";
    const distance = Number(
      this.querySelector<RestaurantOptionSelect>("#distance")?.value
    ) as Distance;
    const description =
      this.querySelector<HTMLTextAreaElement>("#description")?.value;
    const link = this.querySelector<HTMLInputElement>("#link")?.value;

    return { category, name, distance, description, link };
  }
}

export default RestaurantAddModal;
