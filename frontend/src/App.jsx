import { useEffect, useMemo, useState } from "react";
import "./App.css";
import API_URL from "./api.js";
const categories = ["All", "Snacks", "Burgers", "Pizza", "Indian"];

/* =========================================
   MAIN APP
========================================= */

function App() {
  // Load previously saved cart items.
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("streetbite-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", address: "" });
  const [checkoutError, setCheckoutError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Food items fetched from the backend
const [foods, setFoods] = useState([]);
const [foodsLoading, setFoodsLoading] = useState(true);
const [foodsError, setFoodsError] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactMessage, setContactMessage] = useState("");
  const [contactError, setContactError] = useState("");

  // Save cart changes in the browser.
  useEffect(() => {
    localStorage.setItem("streetbite-cart", JSON.stringify(cart));
  }, [cart]);
  // Fetch food items from the backend
useEffect(() => {
  const controller = new AbortController();

  async function fetchFoods() {
    try {
      setFoodsLoading(true);
      setFoodsError("");

      const response = await fetch(
        `${API_URL}/api/foods`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Failed to load the menu.");
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.foods)) {
        throw new Error("Invalid response received from the server.");
      }

      // Add descriptions and frontend category names.
      const descriptions = {
        "Pani Puri": "Crispy puris filled with tangy, spicy water.",
        "Veg Burger": "A delicious veggie patty with fresh vegetables.",
        Pizza: "Cheesy pizza for your favourite cravings.",
        "French Fries": "Golden, crispy fries served fresh.",
        "Cheese Burger": "A juicy burger loaded with melted cheese.",
        "Hot Dog": "A tasty hot dog with delicious toppings.",
        Samosa: "A crispy snack filled with spicy potatoes.",
        "Litti Chokha": "A traditional favourite full of flavour.",
        Chaat: "A flavourful street-food favourite.",
        "Dahi Puri": "Crispy puris filled with potato, yogurt, chutneys, and sev.",
        "Bhel Puri": "A crunchy mix of puffed rice, vegetables, and tangy chutneys.",
        "Aloo Tikki Chaat": "Crisp potato patties topped with yogurt and chutneys.",
        "Masala Samosa": "Golden pastry filled with spiced potatoes and peas.",
        "Vada Pav": "Mumbai-style potato fritter in a soft pav with chutneys.",
        "Paneer Burger": "A crisp paneer patty with fresh vegetables and sauce.",
        "Corn and Cheese Pizza": "Sweet corn and melted cheese on a crisp pizza base.",
        "Pav Bhaji": "Spiced mashed vegetables served with buttery toasted pav.",
        "Tandoori Paneer Pizza": "A cheesy pizza topped with tandoori-spiced paneer.",
        "Paneer Tikka Burger": "Grilled tikka paneer layered into a fresh burger bun.",
        "Masala Dosa": "A crisp dosa filled with spiced potato and served with chutney.",
        Dabeli: "A Gujarati bun filled with spiced potato, chutneys, and crunchy sev.",
      };

      const categoryMap = {
        "Pani Puri": "Snacks",
        "Veg Burger": "Burgers",
        Pizza: "Pizza",
        "French Fries": "Snacks",
        "Cheese Burger": "Burgers",
        "Hot Dog": "Snacks",
        Samosa: "Snacks",
        "Litti Chokha": "Indian",
        Chaat: "Indian",
        "Dahi Puri": "Indian",
        "Bhel Puri": "Snacks",
        "Aloo Tikki Chaat": "Indian",
        "Masala Samosa": "Snacks",
        "Vada Pav": "Snacks",
        "Paneer Burger": "Burgers",
        "Corn and Cheese Pizza": "Pizza",
        "Pav Bhaji": "Indian",
        "Tandoori Paneer Pizza": "Pizza",
        "Paneer Tikka Burger": "Burgers",
        "Masala Dosa": "Indian",
        Dabeli: "Snacks",
      };

      setFoods(
        data.foods.map((food) => ({
          ...food,
          price: Number(food.price),
          description:
            descriptions[food.name] || "A delicious StreetBite favourite.",
          category: categoryMap[food.name] || food.category,
        }))
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Unable to load foods:", error);
        setFoodsError(
          "We couldn't load the menu. Please check that the backend is running and try again."
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setFoodsLoading(false);
      }
    }
  }

  fetchFoods();

  return () => controller.abort();
}, []);

  // Automatically dismiss cart notifications.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Filter food by search text and selected category.
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        food.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Number of individual items in the cart.
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price of all cart items.
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Find the quantity of a specific food.
  function getFoodQuantity(foodId) {
    const item = cart.find((cartItem) => cartItem.id === foodId);
    return item ? item.quantity : 0;
  }

  // Add food or increase its existing quantity.
  function addToCart(food) {
    const currentQuantity = getFoodQuantity(food.id) + 1;
    setToast(`${food.name} added to cart! Quantity: ${currentQuantity}`);
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...food, quantity: 1 }];
    });
  }

  // Increase the quantity of an item.
  function increaseQuantity(foodId) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Decrease quantity and remove items at zero.
  function decreaseQuantity(foodId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Remove an item completely.
  function removeFromCart(foodId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== foodId)
    );
  }

  // Handle contact form submission.
  function handleContactSubmit(event) {
    event.preventDefault();

    const name = contactForm.name.trim();
    const email = contactForm.email.trim();
    const message = contactForm.message.trim();

    if (!name || !email || !message) {
      setContactError("Please complete all the fields.");
      setContactMessage("");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError("Please enter a valid email address.");
      setContactMessage("");
      return;
    }

    // This is a frontend demonstration, not a real email service.
    setContactError("");
    setContactMessage(
      `Thank you, ${name}! Your message has been validated successfully.`
    );

    setContactForm({
      name: "",
      email: "",
      message: "",
    });
  }

  // Validate checkout details and place a demo order.
  // Validate checkout details and save the order in MySQL.
async function handleCheckoutSubmit(event) {
  event.preventDefault();

  const name = checkoutForm.name.trim();
  const phone = checkoutForm.phone.trim();
  const address = checkoutForm.address.trim();

  // Validate customer details
  if (!name || !phone || !address) {
    setCheckoutError("Please fill in all delivery details.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    setCheckoutError("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  if (cart.length === 0) {
    setCheckoutError("Your cart is empty. Add food before checking out.");
    return;
  }

  setCheckoutError("");
  setOrderMessage("");

  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: name,
        phone: phone,
        address: address,
        items: cart.map((item) => ({
          food_id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to place your order.");
    }

    // Only clear the cart after the backend confirms success.
    setOrderMessage(
      `Thank you, ${name}! Your order #${data.order_id} has been placed successfully. Total: ₹${data.total_amount}.`
    );

    setToast(
      `Order placed successfully! Total: ₹${data.total_amount}`
    );

    setCart([]);
    setCheckoutForm({
      name: "",
      phone: "",
      address: "",
    });
    setCheckoutOpen(false);
  } catch (error) {
    console.error("Checkout error:", error);

    setCheckoutError(
      error.message ||
        "Unable to connect to the server. Please try again."
    );
  }
}

  // Scroll to cart and open it.
  function openCart() {
    setShowCart(true);

    window.setTimeout(() => {
      document.getElementById("cart")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  // Open the cart with delivery details ready from the menu.
  function openCheckout() {
    setCheckoutError("");
    setCheckoutOpen(true);
    openCart();
  }

  // Close the cart.
  function closeCart() {
    setShowCart(false);
  }

  return (
    <div className="app">
      {toast && <div className="toast-notification" role="status">✓ {toast}</div>}
      {orderMessage && <div className="order-success" role="status">{orderMessage}<button type="button" onClick={() => setOrderMessage("")} aria-label="Dismiss order confirmation">×</button></div>}
      {/* =====================================
          NAVIGATION
      ===================================== */}

      <header className="navbar">
        <a href="#home" className="logo" aria-label="StreetBite Home">
          Street<span>Bite</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          
        </nav>
        <a href="/admin-login" className="admin-nav-button">
  🔐 Admin Login
</a>
        <button
          className="cart-button"
          type="button"
          onClick={openCart}
          aria-label={`Open cart with ${cartCount} items`}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <main>
        {/* =====================================
            HOME / HERO
        ===================================== */}

        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR FAVOURITE FOOD, ONE CLICK AWAY
            </p>

            <h1>
              Good Food.
              <br />
              <span>Good Mood.</span>
            </h1>

            <p className="hero-description">
              From your favourite street-food classics to irresistible
              cheesy bites, discover delicious flavours made for every
              craving. Your next favourite meal is just a click away!
            </p>

            <div className="hero-buttons">
              <a href="#menu" className="primary-button">
                Explore Our Menu <span>→</span>
              </a>

              <button
                className="secondary-button"
                type="button"
                onClick={openCart}
              >
                🛒 View Cart
              </button>
            </div>

            <p className="hero-trust">
              <span>✦</span> Big flavours. Happy cravings. Every time.
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-circle"></div>

            <img
              src="/images/cheeseburger.jpg"
              alt="Cheeseburger from the StreetBite menu"
              className="hero-food-image"
            />

            <div className="hero-badge">
              <span>🍟</span>
              <div>
                <strong>Fresh &amp; Tasty</strong>
                <p>Made for your cravings</p>
              </div>
            </div>

            <span className="hero-spark hero-spark-one">✳</span>
            <span className="hero-spark hero-spark-two">✦</span>
          </div>
        </section>

        {/* =====================================
            MENU
        ===================================== */}

        <section className="menu-section" id="menu">
          <div className="menu-controls">
            <label className="search-label" htmlFor="food-search">
              Search our menu
            </label>

            <input
              id="food-search"
              className="search-input"
              type="search"
              placeholder="Search for Pani Puri, Burger, Pizza..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="category-filters" aria-label="Food categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-button ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

          {foodsLoading ? (
  <p className="empty-message" role="status">
    Loading delicious food...
  </p>
): foodsError ? (
  <div className="empty-message" role="alert">
    <p>{foodsError}</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  </div>
) : filteredFoods.length === 0 ? (
  <p className="empty-message" role="status">
    No food items found. Try another search!
  </p>
) : (
  <div className="food-grid">
              {filteredFoods.map((food) => {
                const quantity = getFoodQuantity(food.id);

                return (
                  <article className="food-card" key={food.id}>
                    <div className="food-image-wrapper">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="food-image"
                        loading="lazy"
                      />

                      <span className="food-category">
                        {food.category}
                      </span>
                    </div>

                    <div className="food-details">
                      <h3>{food.name}</h3>

                      <p>{food.description}</p>

                      <div className="food-card-bottom">
                        <span className="food-price">
                          ₹{food.price}
                        </span>

                        <button
                          type="button"
                          className={`add-button ${
                            quantity > 0 ? "added" : ""
                          }`}
                          onClick={() => addToCart(food)}
                          aria-label={`Add ${food.name} to cart`}
                        >
                          {quantity > 0
                            ? `Added ✓ (${quantity})`
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <button
            className="primary-button menu-checkout-button"
            type="button"
            onClick={openCheckout}
            disabled={cart.length === 0}
          >
            {cart.length === 0
              ? "Add items to checkout"
              : `Checkout ${cartCount} item${cartCount === 1 ? "" : "s"} · ₹${cartTotal} →`}
          </button>
        </section>

        {/* =====================================
            SHOPPING CART
        ===================================== */}

        {showCart && (
          <section className="cart-section" id="cart">
            <div className="cart-heading">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2>Your Shopping Cart</h2>
              </div>

              <button
                className="close-cart"
                type="button"
                onClick={closeCart}
              >
                ✕ Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">🛒</span>
                <h3>Your cart is waiting!</h3>
                <p>
                  You haven't added any food yet. Explore our menu
                  and find something delicious.
                </p>

                <a
                  className="primary-button"
                  href="#menu"
                  onClick={closeCart}
                >
                  Explore Menu
                </a>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />

                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>₹{item.price} each</p>

                        <div className="quantity-controls">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-end">
                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>

                        <button
                          className="remove-button"
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-total">
                  <div>
                    <p>Order total</p>
                    <h3>₹{cartTotal}</h3>
                  </div>

                  <button
                    className="primary-button checkout-button"
                    type="button"
                    onClick={() => {
                      setCheckoutOpen((open) => !open);
                      setCheckoutError("");
                    }}
                  >
                    {checkoutOpen ? "Hide Checkout ↑" : "Proceed to Checkout →"}
                  </button>
                </div>

                {checkoutOpen && (
                  <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                    <div className="form-heading">
                      <h3>Delivery details</h3>
                      <p>Enter your details to review and place your order.</p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="checkout-name">Full name</label>
                      <input id="checkout-name" type="text" autoComplete="name" placeholder="Enter your full name" value={checkoutForm.name} onChange={(event) => setCheckoutForm({ ...checkoutForm, name: event.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="checkout-phone">Phone number</label>
                      <input id="checkout-phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength="10" placeholder="10-digit mobile number" value={checkoutForm.phone} onChange={(event) => setCheckoutForm({ ...checkoutForm, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="checkout-address">Delivery address</label>
                      <textarea id="checkout-address" rows="3" autoComplete="street-address" placeholder="House number, street, area, city and PIN code" value={checkoutForm.address} onChange={(event) => setCheckoutForm({ ...checkoutForm, address: event.target.value })} required />
                    </div>
                    <div className="checkout-summary">
                      <span>{cartCount} item(s) in your order</span>
                      <strong>Total: ₹{cartTotal}</strong>
                    </div>
                    {checkoutError && <p className="form-error" role="alert">{checkoutError}</p>}
                    <button className="primary-button contact-submit" type="submit">Place Demo Order · ₹{cartTotal}</button>
                    <p className="form-disclaimer">Demo checkout only: this confirms the order in this browser. No payment is taken and no restaurant receives the order.</p>
                  </form>
                )}
              </>
            )}
          </section>
        )}

        {/* =====================================
            ABOUT
        ===================================== */}

        <section className="about-section" id="about">
          <div className="about-content">
            <p className="eyebrow">A LITTLE ABOUT US</p>

            <h2>Good Food Brings People Together.</h2>

            <p>
              At StreetBite, we believe that great food makes everyday
              moments special. Our menu brings together beloved street-food
              favourites, satisfying snacks, cheesy burgers, and more.
            </p>

            <p>
              Whether you're craving a quick bite or treating yourself
              to something delicious, StreetBite is here to make choosing
              your next favourite easier.
            </p>

            <a href="#menu" className="about-button">
              Find Your Favourite →
            </a>
          </div>

          <div className="about-visual" aria-hidden="true">
            <div className="about-food-circle">🍔</div>
            <span className="about-decoration">✦</span>
            <span className="about-decoration second">✳</span>
          </div>
        </section>

        {/* =====================================
            CONTACT
        ===================================== */}

        <section className="contact-section" id="contact">
          <div className="contact-intro">
            <p className="eyebrow">WE'D LOVE TO HEAR FROM YOU</p>

            <h2>Let's Talk Food!</h2>

            <p>
              Have a question, suggestion, or feedback? Send us a message.
              We'd love to know what you think about StreetBite.
            </p>

            <div className="contact-note">
              <span>💬</span>
              <div>
                <strong>Your feedback matters</strong>
                <p>Help us make your StreetBite experience better.</p>
              </div>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <div className="form-heading">
              <h3>Send us a message</h3>
              <p>Fill in the details below.</p>
            </div>

            <div className="form-field">
              <label htmlFor="contact-name">Your name</label>

              <input
                id="contact-name"
                type="text"
                placeholder="Enter your name"
                value={contactForm.name}
                onChange={(event) =>
                  setContactForm({
                    ...contactForm,
                    name: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">Email address</label>

              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={contactForm.email}
                onChange={(event) =>
                  setContactForm({
                    ...contactForm,
                    email: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">Your message</label>

              <textarea
                id="contact-message"
                rows="4"
                placeholder="Tell us what's on your mind..."
                value={contactForm.message}
                onChange={(event) =>
                  setContactForm({
                    ...contactForm,
                    message: event.target.value,
                  })
                }
                required
              />
            </div>

            {contactError && (
              <p className="form-error" role="alert">
                {contactError}
              </p>
            )}

            {contactMessage && (
              <p className="form-success" role="status">
                {contactMessage}
              </p>
            )}

            <button className="primary-button contact-submit" type="submit">
              Send Message →
            </button>

            <p className="form-disclaimer">
              This demo validates your message in the browser. It does not
              send an actual email yet.
            </p>
          </form>
        </section>
      </main>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="footer">
        <a href="#home" className="logo footer-logo">
          Street<span>Bite</span>
        </a>

        <p>
          Good food. Great mood. Made for your cravings.
        </p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} StreetBite. Built with ❤️ and a
          love for food.
        </p>
      </footer>
    </div>
  );
}

export default App;
