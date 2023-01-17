import "./Products.css";
import Card from "./Card.js";

function Products(props) {
  return (
    <div>
      <main>
        <section className="cards">
          <Card name="test" description="asdf adsf asdf asdf safd asfd asfd" />

          <Card name="Item2" description="asdf adsf asdf asdf safd asfd asfd" />
        </section>
      </main>
    </div>
  );
}

export default Products;
