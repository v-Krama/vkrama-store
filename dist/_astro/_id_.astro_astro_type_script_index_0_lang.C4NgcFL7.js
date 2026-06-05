async function p(){const a=localStorage.getItem("vkrama_token");if(!a){window.location.href="/auth/login";return}const r=window.location.pathname.split("/").pop();try{const s=await fetch(`/api/orders/${r}`,{headers:{Authorization:`Bearer ${a}`}});if(s.status===401){localStorage.removeItem("vkrama_token"),window.location.href="/auth/login";return}if(s.status===404){document.getElementById("order-detail").innerHTML='<div class="card p-8 text-center"><p class="text-surface-500">Order not found.</p></div>';return}const e=await s.json(),n=document.getElementById("order-detail"),d=e.status==="delivered"?"badge-green":e.status==="cancelled"?"badge-red":e.status==="paid"||e.status==="processing"?"badge-blue":e.status==="shipped"?"badge-purple":"badge-yellow";let i="";for(const t of e.items||[])i+=`
          <div class="flex items-center gap-4 py-3 border-b border-surface-100 last:border-0">
            ${t.imageUrl?`<img src="${t.imageUrl}" alt="${t.name}" class="w-14 h-14 rounded-lg object-cover bg-surface-100" />`:'<div class="w-14 h-14 rounded-lg bg-surface-100 shrink-0" />'}
            <div class="flex-1 min-w-0">
              <p class="font-medium text-surface-900 text-sm">${t.name}</p>
              ${t.variantName?`<p class="text-xs text-surface-500">${t.variantName}</p>`:""}
              <p class="text-xs text-surface-400">Qty: ${t.quantity} &times; $${(t.priceCents/100).toFixed(2)}</p>
            </div>
            <p class="font-semibold text-surface-900 text-sm">$${(t.priceCents*t.quantity/100).toFixed(2)}</p>
          </div>
        `;n.innerHTML=`
        <div class="card p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-surface-900">Order #${e.id}</h2>
              <p class="text-sm text-surface-400">${new Date(e.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p>
            </div>
            <span class="${d}">${e.status.replace("_"," ")}</span>
          </div>

          ${e.shippingName?`
          <div class="bg-surface-50 rounded-xl p-4 mb-6">
            <h3 class="text-sm font-semibold text-surface-900 mb-2">Shipping Address</h3>
            <div class="text-sm text-surface-600 space-y-0.5">
              <p>${e.shippingName}</p>
              ${e.shippingPhone?`<p>${e.shippingPhone}</p>`:""}
              <p>${e.shippingLine1}</p>
              ${e.shippingLine2?`<p>${e.shippingLine2}</p>`:""}
              <p>${e.shippingCity}, ${e.shippingState} ${e.shippingPostalCode}</p>
            </div>
          </div>`:""}

          <div class="border-t border-surface-200 pt-4">
            <h3 class="font-medium text-surface-900 mb-3">Items</h3>
            ${i||'<p class="text-sm text-surface-500">No items</p>'}
          </div>

          <div class="border-t border-surface-200 pt-4 mt-4 space-y-1.5 text-sm">
            <div class="flex justify-between text-surface-600">
              <span>Subtotal</span>
              <span>$${(e.subtotalCents/100).toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-surface-600">
              <span>Shipping</span>
              <span>${e.shippingCents===0?"Free":`$${(e.shippingCents/100).toFixed(2)}`}</span>
            </div>
            <div class="flex justify-between text-surface-600">
              <span>Tax</span>
              <span>$${(e.taxCents/100).toFixed(2)}</span>
            </div>
            <div class="flex justify-between font-bold text-surface-900 text-base pt-2 border-t border-surface-200 mt-2">
              <span>Total</span>
              <span>$${(e.totalCents/100).toFixed(2)}</span>
            </div>
          </div>

          ${e.paymentMethod==="stripe"?`
          <div class="mt-6 pt-4 border-t border-surface-200 text-xs text-surface-400">
            Payment processed securely via Stripe
          </div>`:""}
        </div>
      `}catch{document.getElementById("order-detail").innerHTML='<div class="card p-8 text-center text-red-500">Failed to load order.</div>'}}p();
