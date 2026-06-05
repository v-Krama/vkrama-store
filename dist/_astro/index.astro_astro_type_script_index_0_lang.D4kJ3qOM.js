function p(){const l=JSON.parse(localStorage.getItem("vkrama_cart")||"[]"),s=document.getElementById("checkout-contents");if(l.length===0){s.innerHTML=`
        <div class="card p-8 text-center">
          <p class="text-surface-500 mb-4">Your cart is empty</p>
          <a href="/products" class="btn-primary">Browse Products</a>
        </div>
      `;return}const a=l.reduce((t,i)=>t+i.priceCents*i.quantity,0),e=a;let r="";for(const t of l)r+=`
        <div class="flex items-center gap-3 py-3 border-b border-surface-100 last:border-0">
          <div class="w-14 h-14 bg-surface-100 rounded-lg overflow-hidden shrink-0">
            ${t.imageUrl?`<img src="${t.imageUrl}" alt="${t.name}" class="w-full h-full object-cover" />`:'<div class="w-full h-full bg-surface-100" />'}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-900 truncate">${t.name}</p>
            <p class="text-xs text-surface-500">Qty: ${t.quantity}</p>
          </div>
          <p class="text-sm font-semibold">$${(t.priceCents*t.quantity/100).toFixed(2)}</p>
        </div>
      `;s.innerHTML=`
      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-surface-900 mb-4">Contact Information</h2>
            <div class="space-y-4">
              <div>
                <label class="label" for="email">Email</label>
                <input type="email" id="email" class="input" value="${localStorage.getItem("vkrama_email")||""}" required />
              </div>
              <div>
                <label class="label" for="phone">Phone (optional)</label>
                <input type="tel" id="phone" class="input" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h2 class="text-lg font-semibold text-surface-900 mb-4">Shipping Address</h2>
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2 sm:col-span-1">
                <label class="label" for="ship-name">Full Name</label>
                <input type="text" id="ship-name" class="input" />
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label class="label" for="ship-phone">Phone</label>
                <input type="tel" id="ship-phone" class="input" />
              </div>
              <div class="col-span-2">
                <label class="label" for="ship-line1">Address Line 1</label>
                <input type="text" id="ship-line1" class="input" />
              </div>
              <div class="col-span-2">
                <label class="label" for="ship-line2">Address Line 2 (optional)</label>
                <input type="text" id="ship-line2" class="input" />
              </div>
              <div>
                <label class="label" for="ship-city">City</label>
                <input type="text" id="ship-city" class="input" />
              </div>
              <div>
                <label class="label" for="ship-state">State</label>
                <input type="text" id="ship-state" class="input" />
              </div>
              <div>
                <label class="label" for="ship-zip">ZIP Code</label>
                <input type="text" id="ship-zip" class="input" />
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h2 class="text-lg font-semibold text-surface-900 mb-4">Payment Method</h2>
            <div class="space-y-3">
              <label class="flex items-center gap-3 p-3 rounded-lg border border-surface-200 cursor-pointer hover:border-brand-300 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 transition-all">
                <input type="radio" name="payment" value="qr" checked class="accent-brand-600" />
                <div>
                  <p class="text-sm font-medium text-surface-900">Scan & Pay (QR)</p>
                  <p class="text-xs text-surface-500">Pay using your payment app</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3 rounded-lg border border-surface-200 cursor-pointer hover:border-brand-300 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 transition-all">
                <input type="radio" name="payment" value="cod" class="accent-brand-600" />
                <div>
                  <p class="text-sm font-medium text-surface-900">Cash on Delivery</p>
                  <p class="text-xs text-surface-500">Pay when you receive your items</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="md:col-span-1">
          <div class="card p-6 sticky top-24">
            <h2 class="text-lg font-semibold text-surface-900 mb-4">Order Summary</h2>
            <div class="mb-4">${r}</div>
            <div class="border-t border-surface-200 pt-4 space-y-1.5 text-sm">
              <div class="flex justify-between text-surface-600">
                <span>Subtotal</span>
                <span>$${(e/100).toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-surface-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="border-t border-surface-200 pt-2 flex justify-between font-bold text-surface-900 text-base">
                <span>Total</span>
                <span>$${(a/100).toFixed(2)}</span>
              </div>
            </div>
            <button id="place-order-btn" class="btn-primary w-full btn-lg mt-6">
              Place Order
            </button>
            <p id="checkout-error" class="text-sm text-red-600 mt-3 hidden"></p>
            <p class="text-xs text-surface-400 text-center mt-3">
              By placing this order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    `,document.getElementById("place-order-btn")?.addEventListener("click",u)}async function u(){const l=JSON.parse(localStorage.getItem("vkrama_cart")||"[]");if(l.length===0)return;const s=document.getElementById("place-order-btn"),a=document.getElementById("checkout-error"),e=o=>document.getElementById(o).value,t=document.querySelector('input[name="payment"]:checked')?.value||"qr",i=e("email");if(!i){a.textContent="Email is required",a.classList.remove("hidden");return}s.disabled=!0,s.textContent="Placing Order...",a.classList.add("hidden");const c={name:e("ship-name")||void 0,phone:e("ship-phone")||void 0,line1:e("ship-line1")||void 0,line2:e("ship-line2")||void 0,city:e("ship-city")||void 0,state:e("ship-state")||void 0,postalCode:e("ship-zip")||void 0};try{const d=await(await fetch("/api/cart/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentMethod:t,email:i,phone:e("phone"),shippingInfo:c.name?c:void 0,items:l.map(n=>({slug:n.slug,quantity:n.quantity,variantId:n.variantId,variantName:n.variantName}))})})).json();d.orderId?(localStorage.removeItem("vkrama_cart"),window.dispatchEvent(new Event("cart-updated")),window.location.href=`/checkout/confirm/${d.orderId}`):(a.textContent=d.error||"Checkout failed. Please try again.",a.classList.remove("hidden"),s.disabled=!1,s.textContent="Place Order")}catch{a.textContent="Network error. Please try again.",a.classList.remove("hidden"),s.disabled=!1,s.textContent="Place Order"}}p();
