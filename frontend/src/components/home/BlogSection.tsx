import { blogs } from '../../data/siteData';

export default function BlogSection() {
  return (
    <section className="blog-section section-pad" id="blog">
      <div className="blog-heading" data-reveal>
        <div>
          <span className="section-label">OUR LATEST BLOGS</span>
          <h2>Read Our Latest Blog Post</h2>
        </div>
        <a className="quote-button" href="#blog">Read all Post</a>
      </div>
      <div className="blog-grid" data-reveal>
        {blogs.map((post) => (
          <article className="blog-card cursor-target" key={post.title}>
            <img src={post.image} alt={post.title} />
            <p><span /> {post.date} _ {post.category}</p>
            <h3>{post.title}</h3>
            <a href="#blog">Read More</a>
          </article>
        ))}
      </div>
    </section>
  );
}
