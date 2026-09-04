import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Share2, 
  ArrowLeft,
  ChevronRight,
  Plus,
  Minus,
  Zap,
  MessageSquare,
  Award
} from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import '../styles/product.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allProducts = useSelector(state => state.products.products);
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);

  const product = allProducts.find(p => String(p.id) === String(id)) || allProducts[0];
  const isWishlisted = wishlistItems.some(item => String(item.id) === String(product?.id));

  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Review Form state
  const [reviewsList, setReviewsList] = useState([
    { id: 1, author: "Marcus Reynolds", rating: 5, date: "2 weeks ago", title: "Phenomenal dynamic range & low light focus", comment: "This has become my daily driver for commercial shoots. Autofocus tracking on eyes and animals is uncanny." },
    { id: 2, author: "Elena Rostova", rating: 5, date: "1 month ago", title: "Cinema standard colors right out of box", comment: "The 10-bit 4:2:2 video capture gives you incredible grading flexibility in DaVinci Resolve. Built like a tank." },
    { id: 3, author: "David Chen", rating: 4, date: "2 months ago", title: "Exceptional build quality and ergonomics", comment: "Buttons and dials feel premium. The grip feels extremely natural even with heavy 70-200mm telephotos." }
  ]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, product]);

  if (!product) {
    return <Loader text="Loading Camera Details..." />;
  }

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const relatedProducts = allProducts.filter(p => p.category?.toLowerCase() === product?.category?.toLowerCase() && String(p.id) !== String(product.id)).slice(0, 4);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newAuthor.trim() && newComment.trim()) {
      setReviewsList([
        {
          id: Date.now(),
          author: newAuthor,
          rating: newRating,
          date: "Just now",
          title: newTitle || "Verified Purchase Review",
          comment: newComment
        },
        ...reviewsList
      ]);
      setNewAuthor('');
      setNewTitle('');
      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3500);
    }
  };

  const discountPercent = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  return (
    <div className="product-details-page">
      {/* Toast Notification */}
      {addedToast && (
        <div className="cart-added-toast">
          <Check size={18} color="#10b981" />
          <span>Added {quantity}x <strong>{product.name}</strong> to Cart!</span>
          <Link to="/cart" className="toast-cart-link">View Cart</Link>
        </div>
      )}

      <div className="container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link to="/" className="crumb-link">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/${product.category.toLowerCase()}`} className="crumb-link">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="crumb-current">{product.name}</span>
        </div>

        {/* Main Product Showcase Layout */}
        <div className="product-showcase-grid">
          {/* Left: Interactive Image Gallery */}
          <div className="product-gallery-section">
            <div className="main-gallery-view">
              <img
                src={selectedImage || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80"}
                alt={product.name}
                className="gallery-main-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80";
                }}
              />
              {discountPercent > 0 && (
                <div className="gallery-discount-badge">SAVE {discountPercent}%</div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {galleryImages.length > 1 && (
              <div className="gallery-thumbnails-reel">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="thumb-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Highlights */}
            <div className="product-guarantee-box">
              <div className="guarantee-item">
                <ShieldCheck size={20} color="#38bdf8" />
                <div>
                  <strong>2-Year Official Brand Warranty</strong>
                  <p>Includes authorized sensor calibration & repairs</p>
                </div>
              </div>
              <div className="guarantee-item">
                <Truck size={20} color="#f97316" />
                <div>
                  <strong>Free Worldwide Priority Delivery</strong>
                  <p>Ships fully insured in reinforced safety flight box</p>
                </div>
              </div>
              <div className="guarantee-item">
                <RotateCcw size={20} color="#10b981" />
                <div>
                  <strong>30-Day Satisfaction Return Policy</strong>
                  <p>Zero restocking fee on manufacturer packaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Buying Details */}
          <div className="product-info-section">
            <div className="product-brand-header">
              <span className="brand-highlight">{product.brand}</span>
              <div className="action-icons-row">
                <button
                  type="button"
                  className={`wishlist-pill-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => dispatch(toggleWishlist(product))}
                >
                  <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "#ffffff"} />
                  <span>{isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}</span>
                </button>
                <button type="button" className="share-pill-btn" onClick={handleShare} title="Share Link">
                  <Share2 size={16} />
                  <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            <h1 className="product-main-title">{product.name}</h1>

            {/* Rating Bar */}
            <div className="product-rating-bar">
              <div className="stars-cluster">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
                <span className="rating-score">{product.rating || 4.9}</span>
              </div>
              <span className="reviews-link-count">
                ({product.reviewsCount || 140} verified creator reviews)
              </span>
              <span className="stock-pill">
                <Check size={14} color="#10b981" /> In Stock ({product.stock || 15} Available)
              </span>
            </div>

            {/* Price Section */}
            <div className="product-price-box">
              <div className="price-main-display">
                <span className="price-current">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="price-savings-tag">
                  Instant Savings: ${(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="product-description-snippet">
              {product.description}
            </p>

            {/* Quick Specs Pill Badges */}
            {product.specs && (
              <div className="quick-specs-grid">
                {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="quick-spec-item">
                    <span className="spec-item-key">{key}</span>
                    <span className="spec-item-val">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Compatibility Summary */}
            {product.compatibility && (
              <div className="compatibility-alert-box">
                <strong>Lens & Mount Compatibility:</strong> {product.compatibility}
              </div>
            )}

            {/* Quantity Selector & Action CTAs */}
            <div className="product-actions-bar">
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="step-count">{quantity}</span>
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock || 20, q + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className="btn-primary add-cart-large"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add To Cart • ${(product.price * quantity).toLocaleString()}</span>
              </button>

              <button
                type="button"
                className="btn-secondary buy-now-btn"
                onClick={handleBuyNow}
              >
                <Zap size={18} color="#f97316" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information */}
        <div className="product-tabs-container">
          <div className="tab-headers-row">
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Full Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              Detailed Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Customer Reviews ({reviewsList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
              onClick={() => setActiveTab('warranty')}
            >
              Shipping & Warranty
            </button>
          </div>

          <div className="tab-content-card">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="specs-tab-view">
                <h3 className="tab-section-title">Technical Specifications</h3>
                <div className="specs-table-wrapper">
                  <table className="specs-table">
                    <tbody>
                      {product.specs && Object.entries(product.specs).map(([label, value]) => (
                        <tr key={label}>
                          <td className="spec-label-col">{label}</td>
                          <td className="spec-value-col">{value}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="spec-label-col">Brand & Manufacturer</td>
                        <td className="spec-value-col">{product.brand} Optics & Cinema</td>
                      </tr>
                      <tr>
                        <td className="spec-label-col">Category</td>
                        <td className="spec-value-col">{product.category} ({product.subCategory || 'Professional'})</td>
                      </tr>
                      <tr>
                        <td className="spec-label-col">Warranty Coverage</td>
                        <td className="spec-value-col">2 Years Authorized Manufacturer Warranty</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Description Tab */}
            {activeTab === 'desc' && (
              <div className="desc-tab-view">
                <h3 className="tab-section-title">Master Engineered Photography Hardware</h3>
                <p className="desc-paragraph">{product.description}</p>
                <div className="feature-bullets-grid">
                  <div className="feature-bullet-card">
                    <div className="feature-bullet-num">01</div>
                    <h4>Flagship Optical Architecture</h4>
                    <p>Engineered with multi-coated nano glass elements and high dynamic range BSI sensor nodes for ultra-clean image fidelity.</p>
                  </div>
                  <div className="feature-bullet-card">
                    <div className="feature-bullet-num">02</div>
                    <h4>AI Subject Recognition</h4>
                    <p>Deep-learning autofocus algorithms tracking humans, animals, vehicles, and birds with pinpoint precision at up to 120 fps.</p>
                  </div>
                  <div className="feature-bullet-card">
                    <div className="feature-bullet-num">03</div>
                    <h4>Weatherproof Magnesium Alloy</h4>
                    <p>Hermetically sealed against moisture, blowing dust, and sub-zero temperatures for untethered expedition shoots.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab-view">
                <div className="reviews-summary-header">
                  <div className="reviews-avg-box">
                    <span className="avg-num">{product.rating || 4.9}</span>
                    <div className="stars-cluster">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="#fbbf24" color="#fbbf24" />)}
                    </div>
                    <span className="avg-sub">Based on {reviewsList.length} reviews</span>
                  </div>
                  <div className="review-breakdown-bars">
                    <div className="breakdown-row"><span>5 Stars</span><div className="bar-track"><div className="bar-fill" style={{ width: '85%' }}></div></div><span>85%</span></div>
                    <div className="breakdown-row"><span>4 Stars</span><div className="bar-track"><div className="bar-fill" style={{ width: '12%' }}></div></div><span>12%</span></div>
                    <div className="breakdown-row"><span>3 Stars</span><div className="bar-track"><div className="bar-fill" style={{ width: '3%' }}></div></div><span>3%</span></div>
                  </div>
                </div>

                {/* Write Review Form */}
                <form onSubmit={handleReviewSubmit} className="add-review-form">
                  <h4>Write a Verified Creator Review</h4>
                  {reviewSuccess && (
                    <div className="review-success-badge">
                      <Check size={16} /> Thank you! Your review has been published.
                    </div>
                  )}
                  <div className="form-row-2">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      required
                    />
                    <div className="rating-select-box">
                      <label>Your Rating:</label>
                      <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Great Quality</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Needs Improvement</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Review Title (e.g. Incredible autofocus & build)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Share your experience shooting with this camera gear..."
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>
                    <MessageSquare size={16} /> Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                <div className="reviews-list-container">
                  {reviewsList.map(rev => (
                    <div key={rev.id} className="single-review-card">
                      <div className="review-card-top">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">{rev.author.charAt(0)}</div>
                          <div>
                            <div className="reviewer-name">{rev.author}</div>
                            <span className="verified-tag">✓ Verified Creator Purchase</span>
                          </div>
                        </div>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div className="review-stars-row">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                        ))}
                        <strong className="review-title-text">{rev.title}</strong>
                      </div>
                      <p className="review-comment-text">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Returns Tab */}
            {activeTab === 'warranty' && (
              <div className="warranty-tab-view">
                <h3 className="tab-section-title">Authorized Dealer Guarantee & Shipping</h3>
                <div className="warranty-points-list">
                  <div className="warranty-point">
                    <Award size={24} color="#f97316" />
                    <div>
                      <h4>2-Year Manufacturer Warranty</h4>
                      <p>All camera bodies and lenses sold by CameraStore are 100% genuine and backed by official global manufacturer warranties with certified repair center access.</p>
                    </div>
                  </div>
                  <div className="warranty-point">
                    <Truck size={24} color="#38bdf8" />
                    <div>
                      <h4>Express Insured Courier Shipping</h4>
                      <p>Orders over ₹100 receive free tracked courier shipping with tamper-evident security tape and shock-absorbent cushioning.</p>
                    </div>
                  </div>
                  <div className="warranty-point">
                    <RotateCcw size={24} color="#10b981" />
                    <div>
                      <h4>30-Day Hassle-Free Returns</h4>
                      <p>If you're not completely amazed by your photography equipment, return it in original condition within 30 days for a full refund.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related / Recommended Gear */}
        {relatedProducts.length > 0 && (
          <section className="related-gear-section">
            <div className="section-header-row">
              <div>
                <span className="section-subtitle">COMPATIBLE & RECOMMENDED</span>
                <h2 className="section-title">Pair With Matching Gear</h2>
              </div>
            </div>
            <div className="product-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
