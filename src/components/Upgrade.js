import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51Qk1VYAmfxBLpZ3vhsafhVnZ5bGhqgbvAfpaRuLRUQE9vFQXrFMVWO9uWgYxOLSmZ85G3JFamUrzrOpzulUHAY7200yYVvHYKi");

const CheckoutForm = ({ product, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Step 1: Request a clientSecret from the backend
      const { data } = await axios.post("http://localhost:5000/api/users/payment", {
        product,
      });

      const clientSecret = data.clientSecret;

      // Step 2: Confirm the card payment on the frontend
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment was successful
        toast.success("Payment successful!");
        onPaymentSuccess(); // Notify parent component
      } else {
        setErrorMessage("Unexpected payment status. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Payment failed. Please try again.");
      console.error("Payment error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        className="form-control mb-3"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#fa755a",
            },
          },
        }}
      />
      {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
      <button type="submit" className="btn btn-primary" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Purchase ${product.name}`}
      </button>
    </form>
  );
};

const Upgrade = () => {
  const [product, setProduct] = useState({
    name: "1 Month Plan",
    price: "$10",
    duration: "1 Month",
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      title: "1 Month Plan",
      price: "$10",
      perks: ["Access to 10 images", "Basic support", "Cancel anytime"],
      duration: "1 Month",
    },
    {
      title: "6 Month Plan",
      price: "$50",
      perks: ["Access to 100 images", "Priority support", "Cancel anytime"],
      duration: "6 Months",
    },
    {
      title: "1 Year Plan",
      price: "$90",
      perks: ["Unlimited access", "Premium support", "Cancel anytime"],
      duration: "1 Year",
    },
  ];

  const handlePaymentSuccess = () => {
    setIsSubscribed(true);
    toast.success("Subscription successful! Redirecting to home...", {
      position: "top-center",
    });
    setTimeout(() => {
      navigate("/home"); // Navigate to home after success
    }, 3000);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container py-5">
        <ToastContainer />
        <h1 className="text-center mb-4 text-primary">Upgrade Your Plan</h1>
        {isSubscribed ? (
          <div className="text-center">
            <h3>You have subscribed to the {product.name}.</h3>
            <p>Your subscription will expire in {product.duration}.</p>
          </div>
        ) : (
          <>
            <div className="row justify-content-center">
              {plans.map((plan, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card shadow-sm mb-4">
                    <div className="card-header text-center bg-primary text-white">
                      <h4>{plan.title}</h4>
                    </div>
                    <div className="card-body text-center">
                      <h2 className="text-primary">{plan.price}</h2>
                      <ul className="list-unstyled mt-3">
                        {plan.perks.map((perk, perkIndex) => (
                          <li key={perkIndex} className="my-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {perk}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() =>
                          setProduct({
                            name: plan.title,
                            price: plan.price,
                            duration: plan.duration,
                          })
                        }
                      >
                        Select {plan.duration}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {product && (
              <div className="mt-5">
                <h3>Complete Your Payment for {product.name}</h3>
                <CheckoutForm product={product} onPaymentSuccess={handlePaymentSuccess} />
              </div>
            )}
          </>
        )}
      </div>
    </Elements>
  );
};

export default Upgrade;
