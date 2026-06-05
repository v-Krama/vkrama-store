const d=window.location.pathname.split("/").pop();async function r(){const t=localStorage.getItem("vkrama_admin_token");try{const a=await fetch(`/api/admin/orders/${d}`,{headers:{Authorization:`Bearer ${t}`}});if(a.status===401){window.location.href="/admin/login";return}const e=await a.json(),n=document.getElementById("order-content"),c=s=>({delivered:"badge-green",cancelled:"badge-red",paid:"badge-blue",processing:"badge-purple",shipped:"badge-blue",pending:"badge-yellow",awaiting_payment:"badge-yellow"})[s]||"badge-gray",p=["pending","awaiting_payment","paid","processing","shipped","delivered","cancelled"].map(s=>`<option value="${s}" ${s===e.status?"selected":""}>${s.replace("_"," ")}</option>`).join("");let i="";for(const s of e.items||[])i+=`<div class="flex items-center justify-between py-3 border-b border-surface-100 last:border-0">
          <div class="flex items-center gap-3">
            ${s.imageUrl?`<img src="${s.imageUrl}" alt="${s.name}" class="w-10 h-10 rounded-lg object-cover bg-surface-100" />`:'<div class="w-10 h-10 rounded-lg bg-surface-100" />'}
            <div>
              <p class="text-sm font-medium text-surface-900">${s.name}</p>
              ${s.variantName?`<p class="text-xs text-surface-500">${s.variantName}</p>`:""}
              <p class="text-xs text-surface-400">Qty: ${s.quantity}</p>
            </div>
          </div>
          <span class="text-sm font-semibold text-surface-900">$${(s.priceCents*s.quantity/100).toFixed(2)}</span>
        </div>`;n.innerHTML=`
        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-surface-900">Order #${e.id}</h2>
                <span class="${c(e.status)}">${e.status.replace("_"," ")}</span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="text-surface-500">Date</span><p class="font-medium text-surface-900">${new Date(e.createdAt).toLocaleString()}</p></div>
                <div><span class="text-surface-500">Email</span><p class="font-medium text-surface-900">${e.email}</p></div>
                ${e.phone?`<div><span class="text-surface-500">Phone</span><p class="font-medium text-surface-900">${e.phone}</p></div>`:""}
                <div><span class="text-surface-500">Payment</span><p class="font-medium text-surface-900">${e.paymentMethod||"—"}</p></div>
              </div>
              <div class="mt-6 pt-4 border-t border-surface-200">
                <label class="label" for="status-select">Update Status</label>
                <div class="flex gap-2">
                  <select id="status-select" class="input flex-1">${p}</select>
                  <button id="update-status" class="btn-primary btn-sm">Update</button>
                </div>
              </div>
            </div>

            <div class="card p-6">
              <h3 class="font-semibold text-surface-900 mb-4">Items</h3>
              ${i||'<p class="text-surface-500 text-sm">No items</p>'}
              <div class="mt-4 pt-4 border-t border-surface-200 space-y-1.5 text-sm">
                <div class="flex justify-between"><span class="text-surface-500">Subtotal</span><span>$${(e.subtotalCents/100).toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-surface-500">Shipping</span><span>${e.shippingCents===0?"Free":`$${(e.shippingCents/100).toFixed(2)}`}</span></div>
                <div class="flex justify-between"><span class="text-surface-500">Tax</span><span>$${(e.taxCents/100).toFixed(2)}</span></div>
                <div class="flex justify-between font-bold text-surface-900 text-base pt-2 border-t border-surface-200 mt-2">
                  <span>Total</span>
                  <span>$${(e.totalCents/100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            ${e.shipping_name?`
            <div class="card p-6">
              <h3 class="font-semibold text-surface-900 mb-3">Shipping Address</h3>
              <div class="text-sm text-surface-600 space-y-0.5">
                <p class="font-medium text-surface-900">${e.shipping_name}</p>
                ${e.shipping_phone?`<p>${e.shipping_phone}</p>`:""}
                <p>${e.shipping_line1}</p>
                ${e.shipping_line2?`<p>${e.shipping_line2}</p>`:""}
                <p>${e.shipping_city}, ${e.shipping_state} ${e.shipping_postal_code}</p>
              </div>
            </div>`:`
            <div class="card p-6">
              <h3 class="font-semibold text-surface-900 mb-3">Shipping</h3>
              <p class="text-sm text-surface-500">No shipping information</p>
            </div>`}

            <div class="card p-6">
              <h3 class="font-semibold text-surface-900 mb-3">Order Timeline</h3>
              <div class="space-y-3 text-sm">
                <div class="flex gap-3">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p class="text-surface-900 font-medium">Order placed</p>
                    <p class="text-surface-400 text-xs">${new Date(e.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                ${e.status==="paid"||e.status==="processing"||e.status==="shipped"||e.status==="delivered"?`
                <div class="flex gap-3">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p class="text-surface-900 font-medium">Payment received</p>
                    <p class="text-surface-400 text-xs">—</p>
                  </div>
                </div>`:""}
                ${e.status==="shipped"||e.status==="delivered"?`
                <div class="flex gap-3">
                  <div class="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p class="text-surface-900 font-medium">Shipped</p>
                    <p class="text-surface-400 text-xs">—</p>
                  </div>
                </div>`:""}
                ${e.status==="delivered"?`
                <div class="flex gap-3">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p class="text-surface-900 font-medium">Delivered</p>
                    <p class="text-surface-400 text-xs">—</p>
                  </div>
                </div>`:""}
              </div>
            </div>
          </div>
        </div>
      `,document.getElementById("update-status")?.addEventListener("click",async()=>{const s=document.getElementById("status-select").value;(await fetch(`/api/admin/orders/${d}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({status:s})})).ok?location.reload():alert("Update failed")})}catch{document.getElementById("order-content").innerHTML='<div class="card p-8 text-center text-red-500">Failed to load order.</div>'}}r();
