import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Upgrade = () => {
  const plans = [
    {
      title: '1 Month Plan',
      price: '$10',
      perks: ['Access to 10 images', 'Basic support', 'Cancel anytime'],
      duration: '1 Month',
    },
    {
      title: '6 Month Plan',
      price: '$50',
      perks: ['Access to 100 images', 'Priority support', 'Cancel anytime'],
      duration: '6 Months',
    },
    {
      title: '1 Year Plan',
      price: '$90',
      perks: ['Unlimited access', 'Premium support', 'Cancel anytime'],
      duration: '1 Year',
    },
  ];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary">Upgrade Your Plan</h1>
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
                <button className="btn btn-primary mt-3">Purchase {plan.duration}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 

export default Upgrade;
