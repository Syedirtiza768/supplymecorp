import { fetchMostViewed, fetchFeaturedProducts, fetchNewProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  console.log('📊 TestPage: Fetching products...');
  
  const [mostViewed, newProds, featured] = await Promise.all([
    fetchMostViewed(3).catch(e => { console.error('Most viewed error:', e); return []; }),
    fetchNewProducts(3).catch(e => { console.error('New products error:', e); return []; }),
    fetchFeaturedProducts(3).catch(e => { console.error('Featured error:', e); return []; }),
  ]);

  console.log('📊 Most Viewed:', mostViewed.length);
  console.log('📊 New Products:', newProds.length);
  console.log('📊 Featured:', featured.length);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Most Viewed Products ({mostViewed.length})</h2>
        <div className="grid gap-4">
          {mostViewed.map(p => (
            <div key={p.id} className="border p-4 rounded">
              <p className="font-bold">SKU: {p.id}</p>
              <p>{p.onlineTitleDescription}</p>
              {p.itemImage1 && <img src={p.itemImage1} alt="" className="w-32 h-32 object-contain mt-2" />}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">New Products ({newProds.length})</h2>
        <div className="grid gap-4">
          {newProds.map(p => (
            <div key={p.id} className="border p-4 rounded">
              <p className="font-bold">SKU: {p.id}</p>
              <p>{p.onlineTitleDescription}</p>
              {p.itemImage1 && <img src={p.itemImage1} alt="" className="w-32 h-32 object-contain mt-2" />}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products ({featured.length})</h2>
        <div className="grid gap-4">
          {featured.map(p => (
            <div key={p.id} className="border p-4 rounded">
              <p className="font-bold">SKU: {p.id}</p>
              <p>{p.onlineTitleDescription}</p>
              {p.itemImage1 && <img src={p.itemImage1} alt="" className="w-32 h-32 object-contain mt-2" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
