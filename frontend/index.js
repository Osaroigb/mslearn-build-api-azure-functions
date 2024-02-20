(function () {
  const API = "http://127.0.0.1:7071/api";

  new Vue({
    el: "#app",
    data: {
      showModal: false,
      products: [],
      brands: ["Home & Pro tools", "Drills Co", "ProSaws", "ElctroDrill"],
      newProduct: { name: "", price: null, stockUnits: null, brand: {} },
      toast: {
        type: "danger",
        message: null,
        show: false
      }
    },
    mounted() {
      this.getProducts();
    },
    methods: {
      getProducts() {
        this.products = axios
          .get(`${API}/products`)
          .then((response) => {
            this.products = response.data;
          })
          .catch((err) => {
            this.showError("Get", err.message);
          });
      },
      updateProduct(index) {
        const product = this.products[index];
        
        if (!product.id || !product.brand || !product.brand.name) {
          this.showError("Update", "Product must have an ID and brand name.");
          return;
        }

        axios
          // .put(`${API}/product`, this.products[index])
          .put(`${API}/product/${product.id}`, {
            ...product,
            brand: { name: product.brand.name } // Ensure the brand object is structured as expected
          })
          .then(() => {
            this.showSuccess("Item updated");
          })
          .catch((err) => {
            this.showError("Update", err.message);
          });
      },
      createProduct() {
        axios
          .post(`${API}/product`, this.newProduct)
          .then((item) => {
            this.products.push(item.data);
            this.showSuccess("Item created");
          })
          .catch((err) => {
            this.showError("Create", err.message);
          })
          .finally(() => {
            this.showModal = false;
          });
      },
      deleteProduct(id, brandName, index) {
        axios
          .delete(`${API}/product/${id}?brandName=${encodeURIComponent(brandName)}`, {
            data: {
              brand: {
                name: brandName
              }
            }
          })
          .then(() => {
            // use the index to remove from the products array
            this.products.splice(index, 1);
            this.showSuccess("Item deleted");
          })
          .catch((err) => {
            this.showError("Delete", err.message);
          });
      },
      showError(action, message) {
        this.showToast(`${action} failed: ${message}`, "danger");
      },
      showSuccess(message) {
        this.showToast(message, "success");
      },
      showToast(message, type) {
        this.toast.message = message;
        this.toast.show = true;
        this.toast.type = type;
        setTimeout(() => {
          this.toast.show = false;
        }, 3000);
      }
    }
  });
})();
